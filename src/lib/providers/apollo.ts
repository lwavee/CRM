// Provider Adapter: Apollo.io API (Organization Enrichment & Decision Maker Search)

export interface ApolloOrgDetails {
  name?: string;
  domain: string;
  employeeCount?: string;
  revenue?: string;
  foundedYear?: number;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
}

export interface ApolloPersonResult {
  fullName: string;
  jobTitle: string;
  email?: string;
  emailStatus?: string;
  emailConfidence?: number;
  phone?: string;
  linkedinUrl?: string;
  isPrimary?: boolean;
}

export async function enrichApolloOrganization(domain: string): Promise<{
  success: boolean;
  org?: ApolloOrgDetails;
  error?: string;
}> {
  const apiKey = process.env.APOLLO_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'APOLLO_API_KEY is not configured in environment.',
    };
  }

  try {
    const url = 'https://api.apollo.io/v1/organizations/enrich';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        api_key: apiKey,
        domain: domain,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Apollo Org Enrich HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    const org = data.organization;

    if (!org) {
      return {
        success: false,
        error: 'No organization record found in Apollo.',
      };
    }

    return {
      success: true,
      org: {
        name: org.name,
        domain: org.primary_domain || domain,
        employeeCount: org.estimated_num_employees ? `${org.estimated_num_employees}+` : undefined,
        revenue: org.annual_revenue_printed || org.annual_revenue ? `$${org.annual_revenue_printed || org.annual_revenue}` : undefined,
        foundedYear: org.founded_year,
        industry: org.industry,
        city: org.city,
        state: org.state,
        country: org.country,
        linkedinUrl: org.linkedin_url && org.linkedin_url.includes('linkedin.com/company/') ? org.linkedin_url : undefined,
        twitterUrl: org.twitter_url,
        facebookUrl: org.facebook_url,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Apollo Org Enrich exception: ${err.message}`,
    };
  }
}

export async function searchApolloPeople(
  domain: string,
  companyName: string
): Promise<{
  success: boolean;
  people: ApolloPersonResult[];
  error?: string;
}> {
  const apiKey = process.env.APOLLO_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      people: [],
      error: 'APOLLO_API_KEY is not configured in environment.',
    };
  }

  try {
    const url = 'https://api.apollo.io/v1/mixed_people/search';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        q_organization_domains: [domain],
        person_titles: [
          'Owner',
          'Founder',
          'Principal',
          'Agency Principal',
          'Managing Partner',
          'CEO',
          'President',
          'Marketing Manager',
          'Marketing Director',
          'COO',
          'Commercial Lines Manager',
        ],
        page: 1,
        per_page: 5,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        people: [],
        error: `Apollo People Search HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    const peopleList = data.people || [];

    const people: ApolloPersonResult[] = peopleList.map((p: any, idx: number) => {
      const fn = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Agency Decision Maker';
      const validLinkedin = p.linkedin_url && p.linkedin_url.includes('linkedin.com/in/') ? p.linkedin_url : undefined;

      return {
        fullName: fn,
        jobTitle: p.title || 'Agency Representative',
        email: p.email,
        emailStatus: p.email_status || (p.email ? 'VALID' : 'UNVERIFIED'),
        emailConfidence: p.email ? 90 : 0,
        phone: p.phone_numbers && p.phone_numbers.length > 0 ? p.phone_numbers[0].raw_number : undefined,
        linkedinUrl: validLinkedin,
        isPrimary: idx === 0,
      };
    });

    return {
      success: true,
      people,
    };
  } catch (err: any) {
    return {
      success: false,
      people: [],
      error: `Apollo People Search exception: ${err.message}`,
    };
  }
}
