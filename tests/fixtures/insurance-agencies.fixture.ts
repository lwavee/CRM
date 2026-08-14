// Test Fixture: Automated Test Fixture Data ONLY (Not for production UI)
import { InsuranceCompany } from '@/lib/data/insurance-db';

export const TEST_INSURANCE_AGENCIES_FIXTURE: InsuranceCompany[] = [
  {
    id: "test-agency-001",
    name: "Test Mountain West Insurance Agency",
    email: "info@mountainwestins.com",
    website: "https://www.mountainwestins.com",
    domain: "mountainwestins.com",
    about: "Test fixture representation of an independent commercial agency.",
    country: "USA",
    state: "Idaho",
    city: "Boise",
    phone: "+1 (208) 378-0200",
    category: "Commercial Insurance",
    foundedYear: 1994,
    employeeCount: "45+",
    revenue: "$18M",
    rating: 4.9,
    googleReviewsCount: 380,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mountain+West+Insurance+Agency+Boise+Idaho",
    status: "Top Tier",
    agencyType: "AGENCY",
    qualityScore: 92,
    opportunityScore: 88,
    verificationStatus: "VERIFIED",
    decisionMakers: [
      {
        id: "test-exec-1",
        fullName: "Brad Sterling",
        jobTitle: "Agency Principal & Founder",
        email: "info@mountainwestins.com",
        phone: "+1 (208) 378-0200 ext 101",
        linkedInUrl: null,
        isPrimary: true
      }
    ]
  }
];
