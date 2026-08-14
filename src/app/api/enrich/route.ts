import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required for enrichment' }, { status: 400 });
    }

    const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
    const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

    let hunterData = null;
    let apolloData = null;

    // 1. Fetch from Hunter.io
    if (HUNTER_API_KEY) {
      try {
        const hunterRes = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${HUNTER_API_KEY}`);
        if (hunterRes.ok) {
          const json = await hunterRes.json();
          hunterData = json.data;
        } else {
          console.error("Hunter API Error:", await hunterRes.text());
        }
      } catch (err) {
        console.error("Hunter fetch failed", err);
      }
    }

    // 2. Fetch from Apollo.io
    if (APOLLO_API_KEY) {
      try {
        const apolloRes = await fetch(`https://api.apollo.io/v1/organizations/enrich?domain=${domain}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'x-api-key': APOLLO_API_KEY
          }
        });
        if (apolloRes.ok) {
          const json = await apolloRes.json();
          apolloData = json.organization;
        } else {
          console.error("Apollo API Error:", await apolloRes.text());
        }
      } catch (err) {
        console.error("Apollo fetch failed", err);
      }
    }

    // 3. Synthesize the data
    const emails = hunterData?.emails || [];
    const bestEmail = emails.length > 0 ? emails[0].value : `[Unverified] contact@${domain}`;
    
    // Attempt to extract a primary decision maker from Hunter if available
    let decisionMaker = {
      name: 'Business Owner',
      title: 'Owner / Director',
      email: bestEmail,
      phone: 'Check Website',
      linkedin: null
    };

    if (emails.length > 0) {
        const execEmail = emails.find((e: any) => e.position && (e.position.toLowerCase().includes('ceo') || e.position.toLowerCase().includes('founder') || e.position.toLowerCase().includes('owner')));
        if (execEmail) {
            decisionMaker = {
                name: `${execEmail.first_name || ''} ${execEmail.last_name || ''}`.trim(),
                title: execEmail.position || 'Executive',
                email: execEmail.value,
                phone: execEmail.phone_number || 'Check Website',
                linkedin: execEmail.linkedin || null
            }
        } else if (emails[0].first_name) {
            decisionMaker = {
                name: `${emails[0].first_name || ''} ${emails[0].last_name || ''}`.trim(),
                title: emails[0].position || 'Contact',
                email: emails[0].value,
                phone: emails[0].phone_number || 'Check Website',
                linkedin: emails[0].linkedin || null
            }
        }
    }

    // Extract Firmographics from Apollo
    const firmographics = {
        employeeCount: apolloData?.estimated_num_employees || 10,
        estimatedRevenue: apolloData?.annual_revenue || 1000000,
        industry: apolloData?.industry || 'Local Business',
        technologies: apolloData?.current_technologies?.map((t: any) => t.name) || ['WordPress'],
        socials: {
            linkedin: apolloData?.linkedin_url,
            twitter: apolloData?.twitter_url,
            facebook: apolloData?.facebook_url
        }
    };

    return NextResponse.json({
      success: true,
      domain,
      decisionMaker,
      firmographics,
      raw: {
          hunter: !!hunterData,
          apollo: !!apolloData
      }
    });

  } catch (error) {
    console.error('Error in /api/enrich:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
