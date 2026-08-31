// Provider Adapter: Google Custom Search API (Domain & Business Website Discovery)

export interface GoogleSearchResultItem {
  title: string;
  snippet: string;
  link: string;
  domain: string;
}

export async function discoverDomainsViaGoogle(
  query: string,
  location: string,
  country: string = 'USA',
  limit: number = 10,
  start: number = 1
): Promise<{ success: boolean; results: GoogleSearchResultItem[]; error?: string }> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    return {
      success: false,
      results: [],
      error: 'GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_CX is not configured in environment.',
    };
  }

  try {
    const searchQuery = `"${query}" "${location}" "${country}" official independent insurance agency domain`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
      searchQuery
    )}&num=${Math.min(limit, 10)}&start=${start}`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return {
        success: false,
        results: [],
        error: `Google Custom Search API returned HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();

    if (data.error) {
      return {
        success: false,
        results: [],
        error: `Google Custom Search Error (${data.error.code}): ${data.error.message}`,
      };
    }

    const items = data.items || [];
    const results: GoogleSearchResultItem[] = [];

    for (const item of items) {
      const link = item.link || '';
      let domain = '';
      try {
        domain = new URL(link).hostname.replace(/^www\./, '').toLowerCase();
      } catch (e) {
        domain = link;
      }

      // Ignore generic directories & social media sites
      const isGeneric =
        domain.includes('google') ||
        domain.includes('wikipedia') ||
        domain.includes('linkedin') ||
        domain.includes('facebook') ||
        domain.includes('yelp') ||
        domain.includes('yellowpages') ||
        domain.includes('mapquest');

      if (domain && !isGeneric) {
        results.push({
          title: item.title,
          snippet: item.snippet || '',
          link: item.link,
          domain: domain,
        });
      }
    }

    return {
      success: true,
      results,
    };
  } catch (err: any) {
    return {
      success: false,
      results: [],
      error: `Google Custom Search network error: ${err.message || String(err)}`,
    };
  }
}
