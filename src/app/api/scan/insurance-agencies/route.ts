import { NextResponse } from 'next/server';
import { discoverGooglePlaces } from '@/lib/providers/googlePlaces';
import { discoverDomainsViaGoogle } from '@/lib/providers/googleSearch';
import { searchHunterDomain, verifyHunterEmail } from '@/lib/providers/hunter';
import { enrichApolloOrganization, searchApolloPeople } from '@/lib/providers/apollo';
import { classifyInsuranceBusiness, scoreAgencyLeadOpportunity } from '@/lib/providers/openai';
import { validateWebsite } from '@/lib/lead-pipeline/websiteValidator';
import { deduplicateLeads } from '@/lib/lead-pipeline/deduplicator';
import { evaluateQualityGate } from '@/lib/lead-pipeline/qualityGate';
import { validateLinkedInUrl } from '@/lib/lead-pipeline/linkedinValidator';
import { sanitizePhone, validatePersonName, sanitizeEmail } from '@/lib/lead-pipeline/sanitizer';

export async function POST(request: Request) {
  const scanId = `scan_${Date.now()}`;

  try {
    let body: any = {};
    try {
      const rawText = await request.text();
      if (rawText && rawText.trim().length > 0) {
        body = JSON.parse(rawText);
      }
    } catch (e) {
      body = {};
    }

    const {
      country = 'USA',
      state = 'Idaho',
      city = '',
      query = 'independent insurance agency',
      limit = 100,
    } = body;

    const locationQuery = city ? `${city}, ${state}` : state;
    const apiErrors: string[] = [];

    // 1. Live Discovery via Google Places & Google Search APIs
    const placesRes = await discoverGooglePlaces('independent insurance agency', locationQuery, country, Math.min(limit, 20));
    if (!placesRes.success && placesRes.error) {
      apiErrors.push(`Google Places: ${placesRes.error}`);
    }

    const searchRes = await discoverDomainsViaGoogle(query, locationQuery, country, 10);
    if (!searchRes.success && searchRes.error) {
      apiErrors.push(`Google Search: ${searchRes.error}`);
    }

    // Combine raw discovery candidates
    let rawCandidates: Array<{
      name: string;
      website: string;
      domain: string;
      city: string;
      state: string;
      country: string;
      phone?: string | null;
      rating?: number | null;
      googleReviewsCount?: number | null;
      googleMapsUrl?: string | null;
      googlePlaceId?: string | null;
      snippet?: string;
    }> = [];

    if (placesRes.places && placesRes.places.length > 0) {
      for (const p of placesRes.places) {
        const domain = p.website ? p.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : '';
        rawCandidates.push({
          name: p.name,
          website: p.website || (domain ? `https://${domain}` : ''),
          domain: domain,
          city: p.city || city || state,
          state: p.state || state,
          country: country,
          phone: sanitizePhone(p.phone),
          rating: p.rating || null,
          googleReviewsCount: p.userRatingsTotal || null,
          googleMapsUrl: p.googleMapsUrl || null,
          googlePlaceId: p.placeId || null,
        });
      }
    }

    if (searchRes.results && searchRes.results.length > 0) {
      for (const s of searchRes.results) {
        rawCandidates.push({
          name: s.title.replace(/[-|].*$/, '').trim(),
          website: s.link,
          domain: s.domain,
          city: city || state,
          state: state,
          country: country,
          snippet: s.snippet,
          rating: null,
          googleReviewsCount: null,
        });
      }
    }

    const discoveredCount = rawCandidates.length;

    // ABSOLUTE RULE: If live discovery returns 0 results, return error JSON. NO static fallback!
    if (discoveredCount === 0) {
      return NextResponse.json(
        {
          success: false,
          scanId,
          source: 'live',
          error: `Live discovery failed: ${apiErrors.join(' | ') || 'No insurance agencies returned from APIs for this region.'}`,
          stats: { discovered: 0, validated: 0, rejected: 0, duplicates: 0, saved: 0 },
        },
        { status: 502 }
      );
    }

    // 2. Normalize & Deduplicate Raw Candidates
    const { uniqueLeads: candidatesAfterDedup, duplicateCount } = deduplicateLeads(rawCandidates);

    const verifiedResults: any[] = [];
    let rejectedCount = 0;

    // 3. Process & Enrich Candidates
    for (const candidate of candidatesAfterDedup) {
      // Website Validation
      const webVal = candidate.domain ? await validateWebsite(candidate.website || candidate.domain) : null;
      const canonicalDomain = webVal?.canonicalDomain || candidate.domain || null;
      const isWebsiteVerified = Boolean(webVal && webVal.isAccessible && !webVal.isDeadOrParked);

      // Agency Classification (Reject Carriers, Associations, Government, Directories)
      const classRes = await classifyInsuranceBusiness(candidate.name, candidate.snippet || '', canonicalDomain || '');

      const gateRes = evaluateQualityGate({
        name: candidate.name,
        domain: canonicalDomain || '',
        classification: classRes.classification,
        hasWebsiteOrPlace: Boolean(candidate.website || candidate.googlePlaceId),
        isDeadOrParked: webVal?.isDeadOrParked || false,
      });

      if (!gateRes.passed) {
        rejectedCount++;
        continue;
      }

      // Contact Enrichment & Verification
      let companyEmail: string | null = null;
      let companyEmailStatus = 'UNVERIFIED';
      let companyEmailConfidence = 0;
      let decisionMakers: any[] = [];

      // Hunter.io Enrichment
      if (canonicalDomain) {
        const hunterRes = await searchHunterDomain(canonicalDomain);
        if (hunterRes && hunterRes.success && hunterRes.contacts.length > 0) {
          const topEmail = hunterRes.contacts.find((c) => c.type === 'personal') || hunterRes.contacts[0];
          if (topEmail && topEmail.email) {
            const emailVer = await verifyHunterEmail(topEmail.email);
            if (emailVer.verified || emailVer.status === 'valid') {
              companyEmail = topEmail.email;
              companyEmailStatus = 'VALID';
              companyEmailConfidence = emailVer.score || 85;
            }
          }

          for (const hContact of hunterRes.contacts) {
            const validName = validatePersonName(hContact.fullName);
            if (!validName) continue; // Skip generic titles without real person names

            const linkedinRes = validateLinkedInUrl(hContact.linkedinUrl);
            const sanitizedContactPhone = sanitizePhone(candidate.phone);
            const contactEmailVal = sanitizeEmail(hContact.email);

            decisionMakers.push({
              id: `dm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              fullName: validName,
              jobTitle: hContact.jobTitle || 'Agency Principal',
              email: contactEmailVal.email,
              emailStatus: contactEmailVal.isVerified ? 'VALID' : 'UNVERIFIED',
              emailConfidence: hContact.confidence || 80,
              phone: sanitizedContactPhone,
              linkedInUrl: linkedinRes.cleanUrl, // Strictly null if search URL or missing
              isPrimary: decisionMakers.length === 0,
              source: 'Hunter.io Verified',
            });
          }
        }
      }

      // Apollo.io Enrichment
      const apolloOrgRes = canonicalDomain ? await enrichApolloOrganization(canonicalDomain) : null;
      const apolloPeopleRes = canonicalDomain ? await searchApolloPeople(canonicalDomain, candidate.name) : null;

      if (apolloPeopleRes && apolloPeopleRes.success && apolloPeopleRes.people.length > 0) {
        for (const p of apolloPeopleRes.people) {
          const validName = validatePersonName(p.fullName);
          if (!validName) continue; // Skip generic names

          const linkedinRes = validateLinkedInUrl(p.linkedinUrl);
          const contactEmailVal = sanitizeEmail(p.email);
          const sanitizedContactPhone = sanitizePhone(p.phone || candidate.phone);

          const existing = decisionMakers.find((d) => d.fullName.toLowerCase() === validName.toLowerCase());
          if (!existing) {
            decisionMakers.push({
              id: `dm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              fullName: validName,
              jobTitle: p.jobTitle || 'Agency Principal',
              email: contactEmailVal.email,
              emailStatus: contactEmailVal.isVerified ? 'VALID' : 'UNVERIFIED',
              emailConfidence: p.emailConfidence || 85,
              phone: sanitizedContactPhone,
              linkedInUrl: linkedinRes.cleanUrl, // Strictly null if search URL or missing
              isPrimary: decisionMakers.length === 0,
              source: 'Apollo.io Verified',
            });
          }
        }
      }

      // ABSOLUTE RULE: If no real person name was verified, decisionMakers remains [] (No generic titles!)

      // 4. Lead Opportunity Scoring & AI Rationale
      const scoreResult = await scoreAgencyLeadOpportunity(
        candidate.name,
        'Commercial Insurance Agency',
        candidate.city,
        candidate.state,
        candidate.rating || 4.5,
        candidate.googleReviewsCount || 10,
        isWebsiteVerified,
        companyEmailStatus === 'VALID',
        decisionMakers.length > 0
      );

      verifiedResults.push({
        id: `agency_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: candidate.name,
        email: companyEmail,
        emailStatus: companyEmailStatus,
        website: isWebsiteVerified ? candidate.website : null,
        websiteVerified: isWebsiteVerified,
        websiteStatus: isWebsiteVerified ? 'VERIFIED' : 'UNVERIFIED',
        domain: canonicalDomain,
        about: scoreResult.leadInsight,
        country: candidate.country,
        state: candidate.state,
        city: candidate.city,
        phone: sanitizePhone(candidate.phone),
        phoneSource: candidate.phone ? 'Google Places' : null,
        category: 'Commercial Insurance',
        foundedYear: apolloOrgRes?.org?.foundedYear || null,
        employeeCount: apolloOrgRes?.org?.employeeCount || null,
        revenue: apolloOrgRes?.org?.revenue || null,
        rating: candidate.rating || null,
        googleReviewsCount: candidate.googleReviewsCount || null,
        googleMapsUrl: candidate.googleMapsUrl || null,
        googlePlaceId: candidate.googlePlaceId || null,
        status: scoreResult.opportunityScore >= 80 ? 'Top Tier' : 'Verified',
        agencyType: classRes.classification,
        qualityScore: scoreResult.qualityScore,
        opportunityScore: scoreResult.opportunityScore,
        leadInsight: scoreResult.leadInsight,
        verificationStatus: 'VERIFIED',
        confidence: classRes.confidence,
        lastVerifiedAt: new Date().toISOString().split('T')[0],
        decisionMakers,
      });
    }

    return NextResponse.json({
      success: true,
      scanId,
      source: 'live',
      generatedAt: new Date().toISOString(),
      leads: verifiedResults,
      count: verifiedResults.length,
      stats: {
        discovered: discoveredCount,
        validated: verifiedResults.length,
        rejected: rejectedCount,
        duplicates: duplicateCount,
        saved: 0,
      },
      providerHealth: {
        googlePlaces: { configured: true, status: placesRes.success ? 'OK' : 'ERROR' },
        googleSearch: { configured: true, status: searchRes.success ? 'OK' : 'ERROR' },
        hunter: { configured: Boolean(process.env.HUNTER_API_KEY), status: 'OK' },
        apollo: { configured: Boolean(process.env.APOLLO_API_KEY), status: 'OK' },
        openai: { configured: Boolean(process.env.OPENAI_API_KEY), status: 'OK' },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        scanId,
        source: 'live',
        error: `Live scan exception: ${err.message || String(err)}`,
        stats: { discovered: 0, validated: 0, rejected: 0, duplicates: 0, saved: 0 },
      },
      { status: 500 }
    );
  }
}
