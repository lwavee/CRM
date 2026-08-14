// EliteOps Production Lead Data Repository
export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website: string;
  requirement: string;
  domain: string;
  industry: string;
  employeeCount: number;
  employeeRange: string;
  estimatedRevenue: string;
  country: 'USA' | 'CANADA' | 'UNITED_KINGDOM' | 'AUSTRALIA' | 'UAE';
  state: string;
  city: string;
  googleMapsUrl?: string;
  googleRating: number;
  googleReviewsCount: number;
  technologies: string[];
  socialProfiles: { linkedin?: string; twitter?: string; facebook?: string };
  status: 'NEW' | 'RESEARCHING' | 'CONTACTED' | 'EMAIL_SENT' | 'MEETING_SCHEDULED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST';
  recommendedService: 'WEBSITE_DEVELOPMENT' | 'DIGITAL_MARKETING' | 'BACK_OFFICE_SUPPORT' | 'VIRTUAL_ASSISTANT' | 'AUTOMATION' | 'AI_SOLUTIONS';
  estimatedDealValue: number;
  opportunityScore: number;
  buyingIntentScore: number;
  agencyFitScore: number;
  buyingSignals: Array<{ id: string; type: string; title: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; detectedAt: string }>;
  websiteAudit: {
    performanceScore: number;
    seoScore: number;
    accessibilityScore: number;
    mobileScore: number;
    loadTimeSeconds: number;
    hasSsl: boolean;
    hasBlog: boolean;
    hasCta: boolean;
    brokenLinksCount: number;
    outdatedTech: boolean;
  };
  decisionMakers: Array<{
    id: string;
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedInUrl: string;
    isPrimary: boolean;
  }>;
  aiSummary: {
    businessSummary: string;
    technicalSummary: string;
    marketingSummary: string;
    primaryPitchReason: string;
    recommendedPricing: string;
  };
  outreachSequence?: {
    pitchAngle: string;
    coldEmail: string;
    followUp1: string;
    followUp2: string;
    linkedInMessage: string;
    callScript: string;
  };
  createdAt: string;
}

export const INITIAL_LEADS: LeadRecord[] = [
  {
    id: "lead-001",
    name: "Stripe, Inc.",
    email: "info@stripe.com",
    phone: "+1 (888) 963-8969",
    website: "https://stripe.com",
    requirement: "Enterprise API Infrastructure & Global Payment Gateway Optimization",
    domain: "stripe.com",
    industry: "Financial Technology",
    employeeCount: 8000,
    employeeRange: "5000+",
    estimatedRevenue: "$14B",
    country: "USA",
    state: "California",
    city: "San Francisco",
    googleMapsUrl: "https://maps.google.com/?q=Stripe+San+Francisco",
    googleRating: 4.8,
    googleReviewsCount: 1450,
    technologies: ["React", "TypeScript", "Ruby on Rails", "Go", "AWS"],
    socialProfiles: { linkedin: "https://linkedin.com/company/stripe", twitter: "@stripe" },
    status: "NEW",
    recommendedService: "AI_SOLUTIONS",
    estimatedDealValue: 45000,
    opportunityScore: 96,
    buyingIntentScore: 98,
    agencyFitScore: 94,
    buyingSignals: [
      { id: "sig-1", type: "HIRING_API_DEV", title: "Hiring Senior Payment API Engineers", severity: "HIGH", detectedAt: "2 hours ago" },
      { id: "sig-2", type: "GLOBAL_EXPANSION", title: "Expanding Merchant Support Ops in LatAm & Asia", severity: "HIGH", detectedAt: "1 day ago" }
    ],
    websiteAudit: {
      performanceScore: 92,
      seoScore: 95,
      accessibilityScore: 90,
      mobileScore: 94,
      loadTimeSeconds: 1.2,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 0,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-1", fullName: "Patrick Collison", jobTitle: "Chief Executive Officer", email: "info@stripe.com", phone: "+1 (888) 963-8969", linkedInUrl: "https://linkedin.com/in/patrickcollison", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "Stripe powers online payment processing for millions of internet businesses globally.",
      technicalSummary: "Modern cloud microservices stack built on Ruby, Go, and React frontend.",
      marketingSummary: "Scaling enterprise integrations and merchant API workflows.",
      primaryPitchReason: "Enterprise API integration support & custom AI automated workflow tooling",
      recommendedPricing: "$45,000 enterprise engagement"
    },
    createdAt: "2026-08-05T10:00:00Z"
  },
  {
    id: "lead-002",
    name: "Shopify Inc.",
    email: "press@shopify.com",
    phone: "+1 (888) 746-7439",
    website: "https://shopify.com",
    requirement: "Custom Merchant Storefront Engine & App Ecosystem Extensions",
    domain: "shopify.com",
    industry: "E-Commerce Software",
    employeeCount: 10000,
    employeeRange: "5000+",
    estimatedRevenue: "$7.5B",
    country: "CANADA",
    state: "Ontario",
    city: "Ottawa",
    googleMapsUrl: "https://maps.google.com/?q=Shopify+Ottawa",
    googleRating: 4.7,
    googleReviewsCount: 3200,
    technologies: ["Ruby on Rails", "React", "GraphQL", "Liquid", "Edge CDN"],
    socialProfiles: { linkedin: "https://linkedin.com/company/shopify", twitter: "@shopify" },
    status: "RESEARCHING",
    recommendedService: "WEBSITE_DEVELOPMENT",
    estimatedDealValue: 38000,
    opportunityScore: 94,
    buyingIntentScore: 92,
    agencyFitScore: 95,
    buyingSignals: [
      { id: "sig-3", type: "HIRING_FRONTEND", title: "Hiring React & GraphQL Specialists", severity: "HIGH", detectedAt: "3 hours ago" },
      { id: "sig-4", type: "STOREFRONT_UPGRADE", title: "Active Hydrogen & Remix Storefront Push", severity: "MEDIUM", detectedAt: "4 hours ago" }
    ],
    websiteAudit: {
      performanceScore: 88,
      seoScore: 94,
      accessibilityScore: 89,
      mobileScore: 91,
      loadTimeSeconds: 1.5,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 0,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-2", fullName: "Tobi Lütke", jobTitle: "Chief Executive Officer", email: "press@shopify.com", phone: "+1 (888) 746-7439", linkedInUrl: "https://linkedin.com/in/tobilutke", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "Shopify provides all-in-one e-commerce infrastructure for online stores and retail POS.",
      technicalSummary: "Ruby on Rails backend with modern Remix / React frontend and Liquid templating.",
      marketingSummary: "Accelerating global merchant onboarding and developer app store integrations.",
      primaryPitchReason: "Headless React/Next.js storefront engine development for high-volume merchants",
      recommendedPricing: "$38,000 project scope"
    },
    createdAt: "2026-08-05T09:30:00Z"
  },
  {
    id: "lead-003",
    name: "Deliveroo plc",
    email: "support@deliveroo.co.uk",
    phone: "+44 20 3699 9977",
    website: "https://deliveroo.co.uk",
    requirement: "Logistics Automation & Dispatch Fleet Portal Upgrade",
    domain: "deliveroo.co.uk",
    industry: "Logistics & On-Demand Delivery",
    employeeCount: 4000,
    employeeRange: "1000-5000",
    estimatedRevenue: "£2.0B",
    country: "UNITED_KINGDOM",
    state: "Greater London",
    city: "London",
    googleMapsUrl: "https://maps.google.com/?q=Deliveroo+London",
    googleRating: 4.3,
    googleReviewsCount: 980,
    technologies: ["Next.js", "Python", "Go", "Kubernetes", "PostgreSQL"],
    socialProfiles: { linkedin: "https://linkedin.com/company/deliveroo", twitter: "@deliveroo" },
    status: "CONTACTED",
    recommendedService: "AUTOMATION",
    estimatedDealValue: 32000,
    opportunityScore: 91,
    buyingIntentScore: 89,
    agencyFitScore: 93,
    buyingSignals: [
      { id: "sig-5", type: "HIRING_OPS", title: "Hiring Fleet & Back-Office Automation Leads", severity: "HIGH", detectedAt: "5 hours ago" },
      { id: "sig-6", type: "DISPATCH_OPTIMIZATION", title: "Upgrading Real-Time Delivery Dispatch Systems", severity: "HIGH", detectedAt: "1 day ago" }
    ],
    websiteAudit: {
      performanceScore: 85,
      seoScore: 91,
      accessibilityScore: 86,
      mobileScore: 88,
      loadTimeSeconds: 1.8,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 1,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-3", fullName: "Will Shu", jobTitle: "Chief Executive Officer", email: "support@deliveroo.co.uk", phone: "+44 20 3699 9977", linkedInUrl: "https://linkedin.com/in/willshu", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "Deliveroo connects customers, restaurants, and riders across the UK, Europe, and Asia.",
      technicalSummary: "Next.js web portal connected to Python and Go microservices for real-time tracking.",
      marketingSummary: "Expanding dark kitchens and rapid delivery network across UK metro areas.",
      primaryPitchReason: "Real-time dispatch automation & operational workflow optimization",
      recommendedPricing: "£25,000 (~$32,000 USD) project scope"
    },
    createdAt: "2026-08-05T08:15:00Z"
  },
  {
    id: "lead-004",
    name: "Careem Networks FZ LLC",
    email: "press@careem.com",
    phone: "+971 4 440 5222",
    website: "https://careem.com",
    requirement: "Super-App Frontend Performance & Back-Office Operations Scaling",
    domain: "careem.com",
    industry: "Mobility & Digital Services",
    employeeCount: 2500,
    employeeRange: "1000-5000",
    estimatedRevenue: "$500M",
    country: "UAE",
    state: "Dubai",
    city: "Dubai",
    googleMapsUrl: "https://maps.google.com/?q=Careem+Dubai",
    googleRating: 4.6,
    googleReviewsCount: 4100,
    technologies: ["React Native", "Java", "Node.js", "AWS Cloud", "Redis"],
    socialProfiles: { linkedin: "https://linkedin.com/company/careem", twitter: "@careem" },
    status: "MEETING_SCHEDULED",
    recommendedService: "BACK_OFFICE_SUPPORT",
    estimatedDealValue: 40000,
    opportunityScore: 93,
    buyingIntentScore: 95,
    agencyFitScore: 91,
    buyingSignals: [
      { id: "sig-7", type: "HIRING_VA", title: "Hiring 20+ Customer Support Specialists", severity: "CRITICAL", detectedAt: "2 hours ago" },
      { id: "sig-8", type: "SUPERAPP_EXPANSION", title: "Scaling Careem Pay & Food Delivery Services", severity: "HIGH", detectedAt: "6 hours ago" }
    ],
    websiteAudit: {
      performanceScore: 82,
      seoScore: 88,
      accessibilityScore: 84,
      mobileScore: 87,
      loadTimeSeconds: 2.1,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 0,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-4", fullName: "Mudassir Sheikha", jobTitle: "Chief Executive Officer", email: "press@careem.com", phone: "+971 4 440 5222", linkedInUrl: "https://linkedin.com/in/mudassirsheikha", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "Careem is the leading Everything App for the greater Middle East, offering ride-hailing, food delivery, and payments.",
      technicalSummary: "React Native cross-platform mobile frontend paired with high-concurrency Node.js services.",
      marketingSummary: "Rapid expansion of digital wallet and merchant services across GCC region.",
      primaryPitchReason: "Dedicated Back-Office Operations & 24/7 Virtual Assistant Support Team",
      recommendedPricing: "$40,000 / year retainer"
    },
    createdAt: "2026-08-05T07:45:00Z"
  },
  {
    id: "lead-005",
    name: "Canva Pty Ltd",
    email: "support@canva.com",
    phone: "+61 2 8599 2200",
    website: "https://canva.com",
    requirement: "HTML5 Canvas Engine Acceleration & 24/7 Virtual Support Staff",
    domain: "canva.com",
    industry: "Design & Visual Software",
    employeeCount: 4500,
    employeeRange: "1000-5000",
    estimatedRevenue: "$1.7B",
    country: "AUSTRALIA",
    state: "New South Wales",
    city: "Sydney",
    googleMapsUrl: "https://maps.google.com/?q=Canva+Sydney",
    googleRating: 4.9,
    googleReviewsCount: 5200,
    technologies: ["TypeScript", "React", "WebGL", "Java", "Cloudflare"],
    socialProfiles: { linkedin: "https://linkedin.com/company/canva", twitter: "@canva" },
    status: "PROPOSAL_SENT",
    recommendedService: "VIRTUAL_ASSISTANT",
    estimatedDealValue: 28000,
    opportunityScore: 90,
    buyingIntentScore: 88,
    agencyFitScore: 92,
    buyingSignals: [
      { id: "sig-9", type: "HIRING_SUPPORT", title: "Hiring Global User Operations Specialists", severity: "HIGH", detectedAt: "4 hours ago" },
      { id: "sig-10", type: "AI_STUDIO_LAUNCH", title: "Expanding Magic Studio AI Tools", severity: "MEDIUM", detectedAt: "1 day ago" }
    ],
    websiteAudit: {
      performanceScore: 94,
      seoScore: 96,
      accessibilityScore: 92,
      mobileScore: 95,
      loadTimeSeconds: 1.1,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 0,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-5", fullName: "Melanie Perkins", jobTitle: "Chief Executive Officer", email: "support@canva.com", phone: "+61 2 8599 2200", linkedInUrl: "https://linkedin.com/in/melanieperkins", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "Canva enables over 170 million monthly active users to design anything and publish anywhere.",
      technicalSummary: "High-performance WebGL and HTML5 rendering engine with TypeScript frontend.",
      marketingSummary: "Rapid adoption in enterprise teams needing streamlined design workflows.",
      primaryPitchReason: "Dedicated offshore tier-1 customer support & account management virtual assistant team",
      recommendedPricing: "A$42,000 (~$28,000 USD) annually"
    },
    createdAt: "2026-08-05T06:30:00Z"
  },
  {
    id: "lead-006",
    name: "Hootsuite Inc.",
    email: "info@hootsuite.com",
    phone: "+1 (888) 350-5196",
    website: "https://hootsuite.com",
    requirement: "Social Analytics Dashboard Modernization & Next.js Rebuild",
    domain: "hootsuite.com",
    industry: "Social Media Software",
    employeeCount: 1200,
    employeeRange: "1000-5000",
    estimatedRevenue: "$250M",
    country: "CANADA",
    state: "British Columbia",
    city: "Vancouver",
    googleMapsUrl: "https://maps.google.com/?q=Hootsuite+Vancouver",
    googleRating: 4.4,
    googleReviewsCount: 610,
    technologies: ["PHP 8.1", "React", "Scala", "MySQL", "AWS"],
    socialProfiles: { linkedin: "https://linkedin.com/company/hootsuite", twitter: "@hootsuite" },
    status: "NEW",
    recommendedService: "WEBSITE_DEVELOPMENT",
    estimatedDealValue: 24000,
    opportunityScore: 89,
    buyingIntentScore: 91,
    agencyFitScore: 87,
    buyingSignals: [
      { id: "sig-11", type: "HIRING_PHP", title: "Hiring Senior Full Stack PHP & React Engineers", severity: "HIGH", detectedAt: "6 hours ago" },
      { id: "sig-12", type: "REBRAND_REFRESH", title: "Upgrading Marketing Site & Analytics Portal", severity: "MEDIUM", detectedAt: "2 days ago" }
    ],
    websiteAudit: {
      performanceScore: 78,
      seoScore: 86,
      accessibilityScore: 80,
      mobileScore: 82,
      loadTimeSeconds: 2.6,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 2,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-6", fullName: "Irina Novoselsky", jobTitle: "Chief Executive Officer", email: "info@hootsuite.com", phone: "+1 (888) 350-5196", linkedInUrl: "https://linkedin.com/in/irinanovoselsky", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "Hootsuite is a leading social media management platform used by over 200,000 businesses.",
      technicalSummary: "Microservices architecture on AWS with React web dashboard and PHP marketing site.",
      marketingSummary: "Pivoting towards AI-powered social content generation and social listening.",
      primaryPitchReason: "Next.js marketing portal overhaul with custom performance optimization",
      recommendedPricing: "$24,000 fixed project scope"
    },
    createdAt: "2026-08-05T05:15:00Z"
  },
  {
    id: "lead-007",
    name: "HubSpot, Inc.",
    email: "sales@hubspot.com",
    phone: "+1 (888) 482-7768",
    website: "https://hubspot.com",
    requirement: "Automated CRM Data Enrichment & Lead Workflows",
    domain: "hubspot.com",
    industry: "B2B Software & Marketing",
    employeeCount: 7500,
    employeeRange: "5000+",
    estimatedRevenue: "$2.1B",
    country: "USA",
    state: "Massachusetts",
    city: "Cambridge",
    googleMapsUrl: "https://maps.google.com/?q=HubSpot+Cambridge",
    googleRating: 4.7,
    googleReviewsCount: 2800,
    technologies: ["Java", "React", "GraphQL", "Kafka", "HBase"],
    socialProfiles: { linkedin: "https://linkedin.com/company/hubspot", twitter: "@hubspot" },
    status: "RESEARCHING",
    recommendedService: "DIGITAL_MARKETING",
    estimatedDealValue: 35000,
    opportunityScore: 92,
    buyingIntentScore: 94,
    agencyFitScore: 90,
    buyingSignals: [
      { id: "sig-13", type: "HIRING_MARKETING", title: "Hiring Growth & Marketing Automation Managers", severity: "HIGH", detectedAt: "1 hour ago" },
      { id: "sig-14", type: "AI_HUB_LAUNCH", title: "Promoting Breeze AI CRM Engine", severity: "MEDIUM", detectedAt: "5 hours ago" }
    ],
    websiteAudit: {
      performanceScore: 90,
      seoScore: 97,
      accessibilityScore: 91,
      mobileScore: 93,
      loadTimeSeconds: 1.3,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 0,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-7", fullName: "Yamini Rangan", jobTitle: "Chief Executive Officer", email: "sales@hubspot.com", phone: "+1 (888) 482-7768", linkedInUrl: "https://linkedin.com/in/yaminirangan", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "HubSpot provides a customer platform with software, integrations, and resources to help businesses grow.",
      technicalSummary: "Scalable Java microservices connected with Kafka event streaming and React UI.",
      marketingSummary: "Heavy inbound marketing and AI tool adoption across SMB and enterprise segments.",
      primaryPitchReason: "Multi-channel PPC & automated B2B lead enrichment pipeline management",
      recommendedPricing: "$35,000 campaign scope"
    },
    createdAt: "2026-08-05T04:00:00Z"
  },
  {
    id: "lead-008",
    name: "Atlassian Corporation",
    email: "sales@atlassian.com",
    phone: "+61 2 9262 1443",
    website: "https://atlassian.com",
    requirement: "DevOps Tooling Cloud Integration & Dedicated Tech Support",
    domain: "atlassian.com",
    industry: "Enterprise Software",
    employeeCount: 11000,
    employeeRange: "5000+",
    estimatedRevenue: "$3.9B",
    country: "AUSTRALIA",
    state: "New South Wales",
    city: "Sydney",
    googleMapsUrl: "https://maps.google.com/?q=Atlassian+Sydney",
    googleRating: 4.6,
    googleReviewsCount: 1900,
    technologies: ["Java", "React", "AWS", "Python", "GraphQL"],
    socialProfiles: { linkedin: "https://linkedin.com/company/atlassian", twitter: "@atlassian" },
    status: "CONTACTED",
    recommendedService: "AUTOMATION",
    estimatedDealValue: 42000,
    opportunityScore: 95,
    buyingIntentScore: 97,
    agencyFitScore: 93,
    buyingSignals: [
      { id: "sig-15", type: "HIRING_SUPPORT_ENG", title: "Hiring Cloud Migration & Technical Support Leads", severity: "HIGH", detectedAt: "3 hours ago" },
      { id: "sig-16", type: "JIRA_AI_EXPANSION", title: "Expanding Atlassian Intelligence Automation", severity: "HIGH", detectedAt: "8 hours ago" }
    ],
    websiteAudit: {
      performanceScore: 91,
      seoScore: 95,
      accessibilityScore: 88,
      mobileScore: 92,
      loadTimeSeconds: 1.4,
      hasSsl: true,
      hasBlog: true,
      hasCta: true,
      brokenLinksCount: 0,
      outdatedTech: false
    },
    decisionMakers: [
      { id: "dm-8", fullName: "Mike Cannon-Brookes", jobTitle: "Co-Founder & Co-CEO", email: "sales@atlassian.com", phone: "+61 2 9262 1443", linkedInUrl: "https://linkedin.com/in/mcannonbrookes", isPrimary: true }
    ],
    aiSummary: {
      businessSummary: "Atlassian makes software products like Jira, Confluence, and Trello to unleash the potential of every team.",
      technicalSummary: "Cloud platform utilizing Java backends, React frontends, and AWS serverless infra.",
      marketingSummary: "Driving enterprise migration from Server/Data Center to Cloud.",
      primaryPitchReason: "Automated Cloud Migration workflow tooling & back-office developer support",
      recommendedPricing: "A$60,000 (~$42,000 USD) annual project"
    },
    createdAt: "2026-08-05T03:30:00Z"
  }
];
