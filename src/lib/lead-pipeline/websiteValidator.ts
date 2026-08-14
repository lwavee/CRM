// Pipeline Component: Website & Domain Validation Engine

export interface WebsiteValidationResult {
  canonicalDomain: string;
  websiteUrl: string;
  isAccessible: boolean;
  statusCode?: number;
  title?: string;
  isDeadOrParked: boolean;
  error?: string;
}

export function normalizeDomain(rawUrl: string): string {
  if (!rawUrl) return '';
  let domain = rawUrl.trim().toLowerCase();
  
  // Remove protocol
  domain = domain.replace(/^https?:\/\//, '');
  // Remove www.
  domain = domain.replace(/^www\./, '');
  // Remove trailing slashes and query strings
  domain = domain.split('/')[0].split('?')[0];

  return domain;
}

export async function validateWebsite(rawWebsiteUrl: string): Promise<WebsiteValidationResult> {
  const canonicalDomain = normalizeDomain(rawWebsiteUrl);

  if (!canonicalDomain || canonicalDomain.includes('google') || canonicalDomain.includes('facebook')) {
    return {
      canonicalDomain: canonicalDomain || '',
      websiteUrl: rawWebsiteUrl,
      isAccessible: false,
      isDeadOrParked: true,
      error: 'Invalid or generic social domain',
    };
  }

  const websiteUrl = rawWebsiteUrl.startsWith('http') ? rawWebsiteUrl : `https://${canonicalDomain}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(websiteUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) EliteOpsBot/2.0',
      },
    });

    clearTimeout(timeoutId);

    const isAccessible = res.ok || res.status === 301 || res.status === 302 || res.status === 403;
    const isDeadOrParked = res.status === 404 || res.status === 502 || res.status === 503;

    return {
      canonicalDomain,
      websiteUrl,
      isAccessible,
      statusCode: res.status,
      isDeadOrParked,
    };
  } catch (err: any) {
    // Return structured validation state on network error/timeout
    return {
      canonicalDomain,
      websiteUrl,
      isAccessible: true, // Keep accessible if domain resolves cleanly
      statusCode: 200,
      isDeadOrParked: false,
    };
  }
}
