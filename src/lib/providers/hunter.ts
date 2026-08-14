// Provider Adapter: Hunter.io API (Domain Search & Email Verifier)

export interface HunterDomainContact {
  fullName: string;
  firstName?: string;
  lastName?: string;
  jobTitle: string;
  email: string;
  confidence: number;
  type: 'personal' | 'generic';
  linkedinUrl?: string;
}

export interface HunterEmailVerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'disposable' | 'accept_all' | 'webmail' | 'unknown';
  score: number;
  reason?: string;
  verified: boolean;
}

export async function searchHunterDomain(domain: string): Promise<{
  success: boolean;
  contacts: HunterDomainContact[];
  organizationName?: string;
  error?: string;
}> {
  const apiKey = process.env.HUNTER_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      contacts: [],
      error: 'HUNTER_API_KEY is not configured in environment.',
    };
  }

  try {
    const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(
      domain
    )}&api_key=${apiKey}&limit=10`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return {
        success: false,
        contacts: [],
        error: `Hunter.io API returned HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();

    if (data.errors && data.errors.length > 0) {
      return {
        success: false,
        contacts: [],
        error: `Hunter.io Error: ${data.errors.map((e: any) => e.details || e.id).join(', ')}`,
      };
    }

    const emails = data.data?.emails || [];
    const contacts: HunterDomainContact[] = emails.map((e: any) => ({
      fullName: e.first_name && e.last_name ? `${e.first_name} ${e.last_name}` : e.value.split('@')[0],
      firstName: e.first_name,
      lastName: e.last_name,
      jobTitle: e.position || (e.type === 'generic' ? 'Company Support Contact' : 'Agency Representative'),
      email: e.value,
      confidence: e.confidence || 75,
      type: e.type || 'generic',
      linkedinUrl: e.linkedin && e.linkedin.includes('linkedin.com/in/') ? e.linkedin : undefined,
    }));

    return {
      success: true,
      contacts,
      organizationName: data.data?.organization,
    };
  } catch (err: any) {
    return {
      success: false,
      contacts: [],
      error: `Hunter.io network error: ${err.message || String(err)}`,
    };
  }
}

export async function verifyHunterEmail(email: string): Promise<HunterEmailVerificationResult> {
  const apiKey = process.env.HUNTER_API_KEY;

  if (!apiKey || !email || !email.includes('@')) {
    return {
      email,
      status: 'unknown',
      score: 0,
      reason: 'No API key or invalid email syntax',
      verified: false,
    };
  }

  try {
    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(
      email
    )}&api_key=${apiKey}`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return {
        email,
        status: 'unknown',
        score: 50,
        reason: `Hunter Verifier HTTP ${res.status}`,
        verified: false,
      };
    }

    const data = await res.json();
    const result = data.data || {};
    const status = result.status || 'unknown';
    const score = result.score || 0;

    return {
      email,
      status: status,
      score: score,
      reason: result.result || status,
      verified: status === 'valid' && score >= 70,
    };
  } catch (err: any) {
    return {
      email,
      status: 'unknown',
      score: 0,
      reason: `Verification exception: ${err.message}`,
      verified: false,
    };
  }
}
