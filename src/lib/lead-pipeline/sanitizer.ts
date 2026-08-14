// Pipeline Component: Strict Data Sanitizer & Placeholder Detector

/**
 * Detects placeholder or suspicious phone numbers (e.g. 555 numbers, 000-0000, 123-4567, 800-555-0199).
 */
export function isPlaceholderPhone(phone?: string | null): boolean {
  if (!phone || typeof phone !== 'string') return true;

  const cleaned = phone.replace(/[^0-9]/g, '');

  // 555 exchange numbers (e.g., 555-0100 to 555-0199 or 555 anywhere)
  if (cleaned.includes('55501') || /555\d{4}$/.test(cleaned) || /^1?800555/.test(cleaned)) {
    return true;
  }

  // Repetitive or sequential dummy numbers
  if (
    cleaned.includes('0000000') ||
    cleaned.includes('1234567') ||
    cleaned.includes('9999999') ||
    cleaned.includes('1111111')
  ) {
    return true;
  }

  // Must have at least 10 digits for standard North American / E.164 phone
  if (cleaned.length < 10) return true;

  return false;
}

/**
 * Normalizes phone numbers to standard E.164 format or returns null if placeholder.
 */
export function sanitizePhone(phone?: string | null): string | null {
  if (isPlaceholderPhone(phone)) return null;

  const trimmed = phone!.trim();
  const digits = trimmed.replace(/[^0-9]/g, '');

  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return trimmed;
}

/**
 * Validates person names. Rejects generic titles like "Managing Principal", "CEO", "Unknown Person".
 * Requires a real first and last name (e.g. "Brad Sterling").
 */
export function validatePersonName(name?: string | null): string | null {
  if (!name || typeof name !== 'string') return null;

  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  const genericTitles = [
    'managing principal',
    'agency owner',
    'owner',
    'founder',
    'president',
    'ceo',
    'coo',
    'cmo',
    'marketing manager',
    'agency manager',
    'unknown person',
    'unknown',
    'default contact',
    'agency representative',
    'primary contact',
    'support contact',
    'info',
    'contact',
  ];

  if (genericTitles.includes(lower)) {
    return null; // Reject generic titles as person names
  }

  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 2) {
    return null; // Require at least first + last name
  }

  return trimmed;
}

/**
 * Validates email addresses. Rejects placeholders (example.com, test.com, dummy@).
 */
export function sanitizeEmail(email?: string | null): { email: string | null; isVerified: boolean } {
  if (!email || typeof email !== 'string') {
    return { email: null, isVerified: false };
  }

  const trimmed = email.trim().toLowerCase();

  if (
    !trimmed.includes('@') ||
    !trimmed.includes('.') ||
    trimmed.includes('example.com') ||
    trimmed.includes('test.com') ||
    trimmed.includes('domain.com') ||
    trimmed.includes('dummy@') ||
    trimmed.includes('fake@')
  ) {
    return { email: null, isVerified: false };
  }

  return { email: trimmed, isVerified: true };
}
