// Pipeline Component: Live Website Contact & Metadata Scraper Engine

import { sanitizePhone } from './sanitizer';
import { sanitizeEmail } from './sanitizer';

export interface ScrapedWebsiteContacts {
  domain: string;
  websiteUrl: string;
  isAccessible: boolean;
  pageTitle?: string;
  email: string | null;
  phone: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  rawEmails: string[];
  rawPhones: string[];
}

export async function scrapeLiveWebsiteContacts(rawDomain: string): Promise<ScrapedWebsiteContacts> {
  const domain = rawDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const websiteUrl = `https://${domain}`;

  const defaultResult: ScrapedWebsiteContacts = {
    domain,
    websiteUrl,
    isAccessible: false,
    email: null,
    phone: null,
    instagramUrl: null,
    facebookUrl: null,
    linkedinUrl: null,
    twitterUrl: null,
    rawEmails: [],
    rawPhones: [],
  };

  if (!domain || domain.includes('google') || domain.includes('facebook')) {
    return defaultResult;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(websiteUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok && res.status !== 301 && res.status !== 302 && res.status !== 403) {
      return defaultResult;
    }

    const html = await res.text();

    // 1. Extract Page Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : undefined;

    // 2. Extract Emails (mailto: and text regex)
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const foundEmails = new Set<string>();

    // Mailto links priority
    const mailtoRegex = /href=["']mailto:([^"?#]+)["']/gi;
    let match: RegExpExecArray | null;
    while ((match = mailtoRegex.exec(html)) !== null) {
      const em = match[1].trim().toLowerCase();
      if (em.includes(domain) || em.includes('.com') || em.includes('.org') || em.includes('.co')) {
        foundEmails.add(em);
      }
    }

    // General regex search
    while ((match = emailRegex.exec(html)) !== null) {
      const em = match[1].toLowerCase();
      // Ignore static asset extensions
      if (!em.endsWith('.png') && !em.endsWith('.jpg') && !em.endsWith('.jpeg') && !em.endsWith('.svg') && !em.endsWith('.js') && !em.endsWith('.css')) {
        if (em.includes(domain)) {
          foundEmails.add(em);
        }
      }
    }

    const validEmailsArray = Array.from(foundEmails)
      .map((e) => sanitizeEmail(e))
      .filter((e) => e.email !== null)
      .map((e) => e.email as string);

    // Pick top verified email matching domain
    let topEmail: string | null = null;
    if (validEmailsArray.length > 0) {
      const domainExact = validEmailsArray.find((e) => e.includes(domain));
      topEmail = domainExact || validEmailsArray[0];
    }

    // 3. Extract Phone Numbers (tel: links and standard phone regex)
    const foundPhones = new Set<string>();
    const telRegex = /href=["']tel:([^"']+)["']/gi;
    while ((match = telRegex.exec(html)) !== null) {
      const sanitized = sanitizePhone(match[1]);
      if (sanitized) foundPhones.add(sanitized);
    }

    // Text phone regex match (US/Intl formats)
    const phoneTextRegex = /(?:\+?1\s*[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    while ((match = phoneTextRegex.exec(html)) !== null) {
      const sanitized = sanitizePhone(match[0]);
      if (sanitized) foundPhones.add(sanitized);
    }

    const validPhonesArray = Array.from(foundPhones);
    const topPhone = validPhonesArray.length > 0 ? validPhonesArray[0] : null;

    // 4. Extract Social Links
    let instagramUrl: string | null = null;
    let facebookUrl: string | null = null;
    let linkedinUrl: string | null = null;
    let twitterUrl: string | null = null;

    const instaMatch = html.match(/href=["'](https?:\/\/(?:www\.)?instagram\.com\/[^"']+)["']/i);
    if (instaMatch) instagramUrl = instaMatch[1];

    const fbMatch = html.match(/href=["'](https?:\/\/(?:www\.)?facebook\.com\/[^"']+)["']/i);
    if (fbMatch) facebookUrl = fbMatch[1];

    const liMatch = html.match(/href=["'](https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[^"']+)["']/i);
    if (liMatch) linkedinUrl = liMatch[1];

    const twMatch = html.match(/href=["'](https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^"']+)["']/i);
    if (twMatch) twitterUrl = twMatch[1];

    return {
      domain,
      websiteUrl,
      isAccessible: true,
      pageTitle,
      email: topEmail,
      phone: topPhone,
      instagramUrl,
      facebookUrl,
      linkedinUrl,
      twitterUrl,
      rawEmails: validEmailsArray,
      rawPhones: validPhonesArray,
    };
  } catch (err) {
    return defaultResult;
  }
}
