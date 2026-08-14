// Production Data Contract for Live Insurance Agency Intelligence
// ABSOLUTE RULE: Prefer NO DATA over WRONG DATA. Unverified fields are null.

export interface ExecutiveContact {
  id: string;
  fullName: string; // Must be a real person's full name (e.g. "Brad Sterling"), not a generic title!
  jobTitle: string;
  email: string | null;
  emailStatus?: string | null;
  emailConfidence?: number | null;
  phone: string | null;
  linkedInUrl: string | null; // Strictly direct profile URL or null. NO search URLs!
  isPrimary?: boolean;
  source?: string;
  confidence?: number;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  email: string | null;
  emailStatus?: string | null;
  website: string | null;
  websiteVerified?: boolean;
  websiteStatus?: string;
  domain?: string | null;
  about: string;
  country: 'USA' | 'CANADA' | 'UNITED_KINGDOM' | 'AUSTRALIA' | 'UAE' | string;
  state: string;
  city: string;
  phone: string | null;
  phoneSource?: string | null;
  category: string;
  foundedYear?: number | null;
  employeeCount?: string | null;
  revenue?: string | null;
  rating?: number | null;
  googleReviewsCount?: number | null;
  googleMapsUrl?: string | null;
  googlePlaceId?: string | null;
  status: 'Active' | 'Verified' | 'Top Tier' | 'Needs Review';
  agencyType?: 'AGENCY' | 'BROKERAGE' | 'CARRIER' | 'ASSOCIATION' | 'GOVERNMENT' | 'DIRECTORY' | 'UNKNOWN';
  qualityScore?: number;
  opportunityScore?: number;
  leadInsight?: string;
  verificationStatus?: string;
  confidence?: number;
  lastVerifiedAt?: string;
  decisionMakers?: ExecutiveContact[];
}

// PRODUCTION CONTRACT: INITIAL_INSURANCE_COMPANIES is empty by default to prevent static demo leads.
export const INITIAL_INSURANCE_COMPANIES: InsuranceCompany[] = [];

export function getCompanyDecisionMakers(company: InsuranceCompany): ExecutiveContact[] {
  return company.decisionMakers || [];
}
