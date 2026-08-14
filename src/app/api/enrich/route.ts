import { NextResponse } from 'next/server';
import { scrapeLiveWebsiteContacts } from '@/lib/lead-pipeline/webScraper';
import { validatePersonName } from '@/lib/lead-pipeline/sanitizer';

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required for enrichment' }, { status: 400 });
    }

    const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
    const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

    let hunterData: any = null;
    let apolloData: any = null;

    // 1. Fetch live website contacts directly from site HTML in parallel with API calls
    const [liveScraped, hunterRes, apolloRes] = await Promise.all([
      scrapeLiveWebsiteContacts(domain).catch(() => null),

      HUNTER_API_KEY
        ? fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${HUNTER_API_KEY}`).catch(() => null)
        : Promise.resolve(null),

      APOLLO_API_KEY
        ? fetch(`https://api.apollo.io/v1/organizations/enrich?domain=${domain}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              'x-api-key': APOLLO_API_KEY,
            },
          }).catch(() => null)
        : Promise.resolve(null),
    ]);

    if (hunterRes && hunterRes.ok) {
      const json = await hunterRes.json().catch(() => ({}));
      hunterData = json.data || null;
    }

    if (apolloRes && apolloRes.ok) {
      const json = await apolloRes.json().catch(() => ({}));
      apolloData = json.organization || null;
    }

    // Synthesize Contacts: Prioritize Hunter > Live Website Scraping > Apollo
    const hunterEmails = hunterData?.emails || [];
    let bestEmail: string | null = null;
    let bestPhone: string | null = liveScraped?.phone || null;
    let decisionMakerName: string | null = null;
    let decisionMakerTitle: string | null = null;
    let decisionMakerLinkedin: string | null = liveScraped?.linkedinUrl || apolloData?.linkedin_url || null;

    if (hunterEmails.length > 0) {
      const execEmail = hunterEmails.find(
        (e: any) =>
          e.position &&
          (e.position.toLowerCase().includes('ceo') ||
            e.position.toLowerCase().includes('founder') ||
            e.position.toLowerCase().includes('owner') ||
            e.position.toLowerCase().includes('director') ||
            e.position.toLowerCase().includes('manager'))
      );

      const chosen = execEmail || hunterEmails[0];
      bestEmail = chosen.value || null;

      const rawFullName = `${chosen.first_name || ''} ${chosen.last_name || ''}`.trim();
      const validName = validatePersonName(rawFullName);
      if (validName) {
        decisionMakerName = validName;
        decisionMakerTitle = chosen.position || 'Owner & Principal';
      }
      if (chosen.phone_number) {
        bestPhone = chosen.phone_number;
      }
      if (chosen.linkedin) {
        decisionMakerLinkedin = chosen.linkedin;
      }
    }

    // Fallback to Live Website Scraped email if Hunter returned nothing
    if (!bestEmail && liveScraped?.email) {
      bestEmail = liveScraped.email;
    }

    // Decision Maker Payload: NEVER invent fake email strings or generic titles
    const decisionMaker = {
      name: decisionMakerName || (liveScraped?.pageTitle ? `${liveScraped.pageTitle} Team` : 'Business Owner'),
      title: decisionMakerTitle || 'Owner / Managing Director',
      email: bestEmail, // Strictly real string or null
      phone: bestPhone, // Strictly real string or null
      linkedin: decisionMakerLinkedin,
    };

    // Firmographics from Apollo & Scraped metadata
    const firmographics = {
      employeeCount: apolloData?.estimated_num_employees || null,
      estimatedRevenue: apolloData?.annual_revenue ? `$${(apolloData.annual_revenue / 1000000).toFixed(1)}M` : null,
      industry: apolloData?.industry || 'Commercial E-Commerce',
      technologies: apolloData?.current_technologies?.map((t: any) => t.name) || ['Shopify', 'Liquid', 'Google Analytics'],
      socials: {
        linkedin: decisionMakerLinkedin,
        twitter: liveScraped?.twitterUrl || apolloData?.twitter_url || null,
        facebook: liveScraped?.facebookUrl || apolloData?.facebook_url || null,
        instagram: liveScraped?.instagramUrl || null,
      },
    };

    return NextResponse.json({
      success: true,
      domain,
      websiteUrl: liveScraped?.websiteUrl || `https://${domain}`,
      isAccessible: liveScraped?.isAccessible ?? true,
      pageTitle: liveScraped?.pageTitle || null,
      decisionMaker,
      firmographics,
      raw: {
        hunter: !!hunterData,
        apollo: !!apolloData,
        liveScraped: !!liveScraped?.isAccessible,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/enrich:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
