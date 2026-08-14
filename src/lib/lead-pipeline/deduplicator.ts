// Pipeline Component: Deduplication & Entity Normalization Engine

export function normalizeCompanyName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(inc|llc|corp|corporation|co|ltd|limited|group|agency|brokerage|brokers|insurance)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function deduplicateLeads<
  T extends { domain?: string | null; googlePlaceId?: string | null; name: string; city?: string | null }
>(leads: T[]): { uniqueLeads: T[]; duplicateCount: number } {
  const seenDomains = new Set<string>();
  const seenPlaceIds = new Set<string>();
  const seenNameLocations = new Set<string>();

  const uniqueLeads: T[] = [];
  let duplicateCount = 0;

  for (const lead of leads) {
    const cleanDomain = lead.domain ? lead.domain.toLowerCase().trim() : '';
    const placeId = lead.googlePlaceId ? lead.googlePlaceId.trim() : '';
    const normName = normalizeCompanyName(lead.name);
    const nameLocKey = `${normName}_${(lead.city || '').toLowerCase().trim()}`;

    let isDuplicate = false;

    if (cleanDomain && seenDomains.has(cleanDomain)) {
      isDuplicate = true;
    } else if (placeId && seenPlaceIds.has(placeId)) {
      isDuplicate = true;
    } else if (normName && normName.length > 3 && seenNameLocations.has(nameLocKey)) {
      isDuplicate = true;
    }

    if (isDuplicate) {
      duplicateCount++;
    } else {
      if (cleanDomain) seenDomains.add(cleanDomain);
      if (placeId) seenPlaceIds.add(placeId);
      if (normName) seenNameLocations.add(nameLocKey);
      uniqueLeads.push(lead);
    }
  }

  return { uniqueLeads, duplicateCount };
}
