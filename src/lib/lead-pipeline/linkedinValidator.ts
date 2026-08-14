// Pipeline Component: LinkedIn URL Strict Validation

export function validateLinkedInUrl(url?: string | null): { isValid: boolean; cleanUrl: string | null } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, cleanUrl: null };
  }

  const trimmed = url.trim();

  // REJECT LinkedIn Search URLs immediately (e.g., https://www.linkedin.com/search/results/people/...)
  if (trimmed.includes('/search/results/') || trimmed.includes('/search/')) {
    return { isValid: false, cleanUrl: null };
  }

  // REJECT fake placeholders or missing tokens
  if (
    trimmed.includes('404') ||
    trimmed.includes('undefined') ||
    trimmed.includes('null') ||
    trimmed.includes('[') ||
    trimmed.includes('example.com')
  ) {
    return { isValid: false, cleanUrl: null };
  }

  // ACCEPT ONLY direct LinkedIn Personal Profiles (/in/) or Company Pages (/company/)
  const isPersonalProfile = /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(trimmed);
  const isCompanyProfile = /https?:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9_-]+\/?$/i.test(trimmed);

  if (isPersonalProfile || isCompanyProfile) {
    return { isValid: true, cleanUrl: trimmed };
  }

  // If it starts with linkedin.com/in/ or linkedin.com/company/
  if (trimmed.includes('linkedin.com/in/') || trimmed.includes('linkedin.com/company/')) {
    return { isValid: true, cleanUrl: trimmed };
  }

  return { isValid: false, cleanUrl: null };
}
