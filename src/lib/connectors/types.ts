// EliteOps Lead Connectors Architecture
export type ConnectorType =
  | 'GOOGLE_MAPS'
  | 'SEARCH_ENGINE'
  | 'JOB_BOARD'
  | 'CRUNCHBASE'
  | 'CSV_IMPORT'
  | 'APOLLO_FEED'
  | 'RSS_FEED';

export interface RawLeadData {
  companyName: string;
  website: string;
  domain: string;
  industry: string;
  country: 'USA' | 'CANADA' | 'UNITED_KINGDOM' | 'AUSTRALIA' | 'UAE';
  state?: string;
  city?: string;
  employeeCount?: number;
  googleRating?: number;
  googleReviewsCount?: number;
  detectedSignals: string[];
  decisionMakers?: Array<{
    fullName: string;
    jobTitle: string;
    email: string;
    phone?: string;
    linkedInUrl?: string;
  }>;
}

export interface LeadConnector {
  id: string;
  name: string;
  type: ConnectorType;
  isEnabled: boolean;
  fetchLeads(): Promise<RawLeadData[]>;
}
