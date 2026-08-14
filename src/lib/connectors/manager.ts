// EliteOps Connector Manager Engine
import { LeadConnector, RawLeadData, ConnectorType } from './types';

export class ConnectorManager {
  private connectors: Map<string, LeadConnector> = new Map();

  constructor() {
    this.registerDefaultConnectors();
  }

  private registerDefaultConnectors() {
    // 1. Google Maps Local Business Connector
    this.register({
      id: 'conn-gmaps',
      name: 'Google Maps Business Intelligence',
      type: 'GOOGLE_MAPS',
      isEnabled: true,
      async fetchLeads(): Promise<RawLeadData[]> {
        return [
          {
            companyName: 'Apex Financial Services',
            website: 'https://apexfinancialgroup.example.com',
            domain: 'apexfinancialgroup.example.com',
            industry: 'Financial Services',
            country: 'USA',
            state: 'New York',
            city: 'New York',
            employeeCount: 45,
            googleRating: 3.8,
            googleReviewsCount: 12,
            detectedSignals: ['LOW_GOOGLE_REVIEWS', 'SLOW_WEBSITE', 'HIRING_OPERATIONS_MANAGER'],
            decisionMakers: [
              {
                fullName: 'Robert Vance',
                jobTitle: 'Managing Director',
                email: 'rvance@apexfinancialgroup.example.com',
                phone: '+1 212 555 0192',
                linkedInUrl: 'https://linkedin.com/in/robertvance',
              },
            ],
          },
          {
            companyName: 'Bespoke Legal Partners UK',
            website: 'https://bespokelegal.example.co.uk',
            domain: 'bespokelegal.example.co.uk',
            industry: 'Legal & Compliance',
            country: 'UNITED_KINGDOM',
            state: 'London',
            city: 'London',
            employeeCount: 28,
            googleRating: 4.1,
            googleReviewsCount: 8,
            detectedSignals: ['OUTDATED_WEBSITE', 'NO_MOBILE_OPTIMIZATION', 'NO_BLOG'],
            decisionMakers: [
              {
                fullName: 'Eleanor Sterling',
                jobTitle: 'Senior Partner',
                email: 'esterling@bespokelegal.example.co.uk',
                phone: '+44 20 7946 0912',
                linkedInUrl: 'https://linkedin.com/in/eleanorsterling',
              },
            ],
          },
        ];
      },
    });

    // 2. Job Board & Recruiting Intent Scanner
    this.register({
      id: 'conn-jobs',
      name: 'Job Board Intent Radar',
      type: 'JOB_BOARD',
      isEnabled: true,
      async fetchLeads(): Promise<RawLeadData[]> {
        return [
          {
            companyName: 'Nexus AI Solutions',
            website: 'https://nexusai.example.io',
            domain: 'nexusai.example.io',
            industry: 'Information Technology',
            country: 'CANADA',
            state: 'Ontario',
            city: 'Toronto',
            employeeCount: 80,
            googleRating: 4.8,
            googleReviewsCount: 45,
            detectedSignals: ['HIRING_REACT_DEV', 'HIRING_SEO_EXPERT', 'RECENTLY_FUNDED'],
            decisionMakers: [
              {
                fullName: 'David Chen',
                jobTitle: 'VP of Technology',
                email: 'dchen@nexusai.example.io',
                phone: '+1 416 555 0144',
                linkedInUrl: 'https://linkedin.com/in/davidchentech',
              },
            ],
          },
        ];
      },
    });

    // 3. Crunchbase / Investment Feed
    this.register({
      id: 'conn-crunchbase',
      name: 'Crunchbase Funding Feed',
      type: 'CRUNCHBASE',
      isEnabled: true,
      async fetchLeads(): Promise<RawLeadData[]> {
        return [
          {
            companyName: 'Solaris Health UAE',
            website: 'https://solarishealth.example.ae',
            domain: 'solarishealth.example.ae',
            industry: 'Healthcare & Wellness',
            country: 'UAE',
            state: 'Dubai',
            city: 'Dubai',
            employeeCount: 120,
            googleRating: 4.6,
            googleReviewsCount: 88,
            detectedSignals: ['RECENTLY_EXPANDED_TEAM', 'HIRING_VIRTUAL_ASSISTANT', 'HIRING_DATA_ENTRY'],
            decisionMakers: [
              {
                fullName: 'Tariq Al-Maktoum',
                jobTitle: 'Chief Operating Officer',
                email: 'tmaktoum@solarishealth.example.ae',
                phone: '+971 4 312 8890',
                linkedInUrl: 'https://linkedin.com/in/tariqalmaktoum',
              },
            ],
          },
        ];
      },
    });
  }

  public register(connector: LeadConnector) {
    this.connectors.set(connector.id, connector);
  }

  public getConnectors(): LeadConnector[] {
    return Array.from(this.connectors.values());
  }

  public setEnabled(id: string, isEnabled: boolean) {
    const conn = this.connectors.get(id);
    if (conn) {
      conn.isEnabled = isEnabled;
    }
  }

  public async runEnabledConnectors(): Promise<RawLeadData[]> {
    const results: RawLeadData[] = [];
    for (const connector of this.connectors.values()) {
      if (connector.isEnabled) {
        const data = await connector.fetchLeads();
        results.push(...data);
      }
    }
    return results;
  }
}
