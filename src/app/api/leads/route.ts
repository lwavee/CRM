import { NextResponse } from 'next/server';
import { INITIAL_LEADS, LeadRecord } from '@/lib/data/mock-db';
import { calculateLeadOpportunityScore } from '@/lib/ai/scoring-engine';

let leadsStore: LeadRecord[] = [...INITIAL_LEADS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const country = searchParams.get('country');
  const service = searchParams.get('service');
  const minScore = parseInt(searchParams.get('minScore') || '0', 10);
  const status = searchParams.get('status');

  let filtered = leadsStore.filter((lead) => {
    if (search) {
      const matchName = lead.name.toLowerCase().includes(search);
      const matchIndustry = lead.industry.toLowerCase().includes(search);
      const matchTech = lead.technologies.some((t) => t.toLowerCase().includes(search));
      const matchDomain = lead.domain.toLowerCase().includes(search);
      if (!matchName && !matchIndustry && !matchTech && !matchDomain) return false;
    }
    if (country && lead.country !== country) return false;
    if (service && lead.recommendedService !== service) return false;
    if (status && lead.status !== status) return false;
    if (lead.opportunityScore < minScore) return false;
    return true;
  });

  return NextResponse.json({
    success: true,
    count: filtered.length,
    total: leadsStore.length,
    leads: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newId = `lead-${Date.now()}`;
    const domain = body.website ? new URL(body.website).hostname : `${body.name.toLowerCase().replace(/\s+/g, '')}.com`;

    const scoring = calculateLeadOpportunityScore({
      websitePerformanceScore: body.performanceScore || 60,
      seoScore: body.seoScore || 55,
      mobileScore: body.mobileScore || 60,
      loadTimeSeconds: body.loadTimeSeconds || 4.0,
      hasSsl: body.hasSsl ?? true,
      brokenLinksCount: body.brokenLinksCount || 3,
      outdatedTech: body.outdatedTech ?? true,
      hiringSignals: body.hiringSignals || ['HIRING_DEV'],
      isRecentlyFunded: body.isRecentlyFunded || false,
      googleRating: body.googleRating || 4.2,
      googleReviewsCount: body.googleReviewsCount || 15,
      employeeCount: body.employeeCount || 25,
      country: body.country || 'USA',
    });

    const newLead: LeadRecord = {
      id: newId,
      name: body.name || 'New Discovered Lead',
      email: body.contactEmail || body.email || `contact@${domain}`,
      phone: body.contactPhone || body.phone || '+1 (800) 555-0100',
      requirement: body.requirement || 'Full Stack Web Development & Operational Automation',
      website: body.website || `https://${domain}`,
      domain,
      industry: body.industry || 'Business Services',
      employeeCount: body.employeeCount || 25,
      employeeRange: '10-50',
      estimatedRevenue: '$2.5M',
      country: body.country || 'USA',
      state: body.state || 'California',
      city: body.city || 'Los Angeles',
      googleRating: body.googleRating || 4.2,
      googleReviewsCount: body.googleReviewsCount || 15,
      technologies: body.technologies || ['WordPress', 'PHP'],
      socialProfiles: { linkedin: `https://linkedin.com/company/${domain}` },
      status: 'NEW',
      recommendedService: scoring.recommendedService,
      estimatedDealValue: 15000,
      opportunityScore: scoring.finalOpportunityScore,
      buyingIntentScore: scoring.buyingIntentScore,
      agencyFitScore: scoring.agencyFitScore,
      buyingSignals: [
        { id: `sig-${Date.now()}`, type: 'HIRING_DEV', title: 'Hiring Full-Stack Web Developer', severity: 'HIGH', detectedAt: 'Just now' },
        { id: `sig-${Date.now() + 1}`, type: 'SLOW_WEBSITE', title: `Slow Load Time (${body.loadTimeSeconds || 4.0}s)`, severity: 'HIGH', detectedAt: 'Just now' },
      ],
      websiteAudit: {
        performanceScore: body.performanceScore || 60,
        seoScore: body.seoScore || 55,
        accessibilityScore: 70,
        mobileScore: 60,
        loadTimeSeconds: body.loadTimeSeconds || 4.0,
        hasSsl: body.hasSsl ?? true,
        hasBlog: false,
        hasCta: true,
        brokenLinksCount: 3,
        outdatedTech: true,
      },
      decisionMakers: [
        {
          id: `dm-${Date.now()}`,
          fullName: body.contactName || 'Primary Executive',
          jobTitle: body.contactTitle || 'Managing Director',
          email: body.contactEmail || `contact@${domain}`,
          phone: body.contactPhone || '+1 310 555 0100',
          linkedInUrl: `https://linkedin.com/in/${body.contactName?.toLowerCase().replace(/\s+/g, '') || 'executive'}`,
          isPrimary: true,
        },
      ],
      aiSummary: {
        businessSummary: `${body.name} operates in ${body.industry}. AI audit reveals clear opportunities for digital transformation.`,
        technicalSummary: `Current web infrastructure scored ${body.performanceScore || 60}/100 with optimization needed.`,
        marketingSummary: `Active hiring intent detected for digital services and back-office support.`,
        primaryPitchReason: scoring.primaryPitchReason,
        recommendedPricing: '$12,500 - $25,000 package',
      },
      createdAt: new Date().toISOString(),
    };

    leadsStore.unshift(newLead);

    return NextResponse.json({
      success: true,
      lead: newLead,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
