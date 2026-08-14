export interface WebDevClientLead {
  id: string;
  name: string;
  website: string;
  domain: string;
  email: string;
  phone: string;
  country: 'USA' | 'CANADA' | 'UNITED_KINGDOM' | 'AUSTRALIA' | 'UAE';
  state: string;
  city: string;
  industry: string;
  projectType: 'Next.js Rebuild' | 'WordPress Migration' | 'UI/UX Redesign' | 'E-commerce Platform' | 'SaaS Landing Pages' | 'Web App Portal';
  estimatedBudget: number; // in USD
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  currentStack: string[];
  recommendedStack: string[];
  audit: {
    performanceScore: number; // 0 - 100
    seoScore: number; // 0 - 100
    mobileScore: number; // 0 - 100
    securityScore: number; // 0 - 100
    loadTimeSeconds: number;
    issuesCount: number;
    topIssue: string;
  };
  decisionMaker: {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
  };
  buyingSignal: string;
  detectedAt: string;
  aiPitch: {
    headline: string;
    painPoint: string;
    proposedSolution: string;
    coldEmailSubject: string;
    coldEmailBody: string;
  };
  status: 'New Lead' | 'Audit Generated' | 'Contacted' | 'Proposal Sent' | 'Closed Won';
}

export const INITIAL_WEBDEV_CLIENTS: WebDevClientLead[] = [
  {
    id: "wd-001",
    name: "Cervera Real Estate",
    website: "https://cervera.com",
    domain: "cervera.com",
    email: "info@cervera.com",
    phone: "+1 (305) 374-3434",
    country: "USA",
    state: "Florida",
    city: "Miami",
    industry: "Real Estate & Architecture",
    projectType: "Next.js Rebuild",
    estimatedBudget: 28500,
    urgency: "CRITICAL",
    currentStack: ["WordPress", "WPBakery Builder", "PHP", "Slow Slider Revolution"],
    recommendedStack: ["Next.js 14", "Tailwind CSS", "Sanity CMS", "Mapbox GL API", "Vercel"],
    audit: {
      performanceScore: 32,
      seoScore: 61,
      mobileScore: 41,
      securityScore: 78,
      loadTimeSeconds: 5.8,
      issuesCount: 14,
      topIssue: "Heavy WordPress sliders stalling mobile load time by 5.8s & low Google Core Web Vitals score."
    },
    decisionMaker: {
      name: "Alicia Cervera Lamadrid",
      title: "Managing Partner",
      email: "alamadrid@cervera.com",
      phone: "+1 (305) 374-3434",
      linkedin: "https://www.linkedin.com/in/aliciacerveralamadrid"
    },
    buyingSignal: "Needs performance upgrade for luxury property showcase to global high-net-worth buyers",
    detectedAt: "2 hours ago",
    aiPitch: {
      headline: "Sub-1-Second Mobile Load Times & Interactive 3D Property Showcase for Cervera",
      painPoint: "Current WordPress site takes 5.8 seconds on mobile, losing high-intent luxury home buyers to tech-forward competitors.",
      proposedSolution: "Custom Next.js 14 + Tailwind CSS rebuild with instant page transitions, interactive Mapbox MLS search, and Sanity Headless CMS.",
      coldEmailSubject: "Transforming Cervera's 5.8s load time into a conversion engine",
      coldEmailBody: "Hi Alicia,\n\nI was browsing cervera.com and noticed that heavy legacy plugins are causing mobile load times of nearly 6 seconds. In Miami's luxury real estate market, a slow site means lost high-net-worth buyers.\n\nWe specialize in rebuilding legacy real estate portals with Next.js 14, cutting load times to under 1 second and doubling mobile contact conversion rates. You can see our cutting-edge work and how we transform businesses at http://eliteoperationglobal.com/.\n\nLet's turn your website into your strongest sales asset. Are you open to a quick 5-minute teardown call this week?\n\nBest,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "New Lead"
  },
  {
    id: "wd-002",
    name: "Parkview Dental",
    website: "https://parkviewdentaltoronto.com",
    domain: "parkviewdentaltoronto.com",
    email: "info@parkviewdentaltoronto.com",
    phone: "+1 (416) 322-5200",
    country: "CANADA",
    state: "Ontario",
    city: "Toronto",
    industry: "Healthcare & Dentistry",
    projectType: "UI/UX Redesign",
    estimatedBudget: 35000,
    urgency: "HIGH",
    currentStack: ["Legacy CMS", "jQuery", "Bootstrap", "Apache"],
    recommendedStack: ["React", "Next.js", "Tailwind CSS", "HIPAA/PIPEDA Compliant API", "AWS Amplify"],
    audit: {
      performanceScore: 45,
      seoScore: 72,
      mobileScore: 49,
      securityScore: 65,
      loadTimeSeconds: 4.2,
      issuesCount: 11,
      topIssue: "Outdated theme missing automated patient appointment booking & responsive mobile layout."
    },
    decisionMaker: {
      name: "Dr. Jason Wong",
      title: "Principal Dentist",
      email: "dr.wong@parkviewdentaltoronto.com",
      phone: "+1 (416) 322-5200",
      linkedin: "https://linkedin.com/in/drjasonwong-toronto"
    },
    buyingSignal: "Local search indicates need for modernized patient acquisition funnel",
    detectedAt: "5 hours ago",
    aiPitch: {
      headline: "Modern PIPEDA Compliant Dental Patient Portal UI for Parkview Dental",
      painPoint: "Current platform lacks modern UI, preventing patients from booking online appointments seamlessly on mobile.",
      proposedSolution: "Complete React/Next.js frontend facelift integrated with automated online booking and SMS patient reminders.",
      coldEmailSubject: "Modernizing Parkview Dental's digital patient experience",
      coldEmailBody: "Hi Dr. Wong,\n\nI was analyzing Parkview Dental's website and noticed patients cannot easily book appointments directly via an integrated mobile portal. A seamless digital experience is critical for acquiring modern healthcare patients.\n\nAt EliteOps, we build custom, PIPEDA-compliant medical web applications that streamline patient intake and reduce front-desk call volume by over 40%. You can explore our high-performance solutions at http://eliteoperationglobal.com/.\n\nWould you be open to reviewing a custom Figma prototype we’ve mocked up for an updated booking portal?\n\nBest,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "New Lead"
  },
  {
    id: "wd-003",
    name: "The Mercantile London",
    website: "https://themercantilelondon.com",
    domain: "themercantilelondon.com",
    email: "hello@themercantilelondon.com",
    phone: "+44 20 7377 8926",
    country: "UNITED_KINGDOM",
    state: "England",
    city: "London",
    industry: "E-Commerce & Fashion",
    projectType: "E-commerce Platform",
    estimatedBudget: 48000,
    urgency: "CRITICAL",
    currentStack: ["Shopify Liquid", "Heavy JS Apps", "Unoptimized Images"],
    recommendedStack: ["Shopify Plus Headless", "Next.js Storefront", "Tailwind CSS", "Klaviyo API"],
    audit: {
      performanceScore: 28,
      seoScore: 54,
      mobileScore: 35,
      securityScore: 60,
      loadTimeSeconds: 6.4,
      issuesCount: 19,
      topIssue: "Heavy Shopify apps slowing down mobile checkout, causing 65% cart abandonment."
    },
    decisionMaker: {
      name: "Debra Denny",
      title: "Founder & Creative Director",
      email: "debra@themercantilelondon.com",
      phone: "+44 20 7377 8926",
      linkedin: "https://linkedin.com/in/debradenny-london"
    },
    buyingSignal: "High-traffic boutique needing headless e-commerce for international scaling",
    detectedAt: "30 minutes ago",
    aiPitch: {
      headline: "Headless Shopify Storefront with Sub-Second Checkout for The Mercantile London",
      painPoint: "Standard Shopify Liquid setup is choking under heavy app usage, leading to 6.4s load times and lost revenue.",
      proposedSolution: "Headless Next.js e-commerce storefront linked to Shopify backend, offering instant product filtering and 0.8s checkout.",
      coldEmailSubject: "Eliminating cart abandonment for The Mercantile with Headless Next.js",
      coldEmailBody: "Hi Debra,\n\nI saw your incredible boutique in Spitalfields and noticed the online store's 6.4s mobile load times are directly driving up cart abandonment.\n\nWe've successfully migrated independent fashion brands to Headless Next.js + Shopify, resulting in 3x faster page speeds and a 28% increase in conversions. Take a look at our case studies and capabilities at http://eliteoperationglobal.com/.\n\nLet's connect for 10 minutes to discuss how we can execute this high-performance rebuild and scale your online sales globally.\n\nBest,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "Proposal Sent"
  },
  {
    id: "wd-004",
    name: "APEX Capital Realty",
    website: "https://apexcapitalrealty.com",
    domain: "apexcapitalrealty.com",
    email: "info@apexcapitalrealty.com",
    phone: "+1 (305) 570-2600",
    country: "USA",
    state: "Florida",
    city: "Miami",
    industry: "Commercial Real Estate",
    projectType: "SaaS Landing Pages",
    estimatedBudget: 22000,
    urgency: "HIGH",
    currentStack: ["WordPress", "Elementor", "Google Analytics v3"],
    recommendedStack: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Mapbox", "PostHog"],
    audit: {
      performanceScore: 58,
      seoScore: 78,
      mobileScore: 62,
      securityScore: 90,
      loadTimeSeconds: 3.1,
      issuesCount: 7,
      topIssue: "Static WordPress template limits dynamic commercial property map filters."
    },
    decisionMaker: {
      name: "Miguel Pinto",
      title: "President & Managing Broker",
      email: "miguel@apexcapitalrealty.com",
      phone: "+1 (305) 570-2600",
      linkedin: "https://linkedin.com/in/miguelpinto-miami"
    },
    buyingSignal: "Expanding commercial portfolio in South Florida; needs modern digital map interface",
    detectedAt: "1 day ago",
    aiPitch: {
      headline: "Commercial Real Estate Portal & High-Converting Map Architecture",
      painPoint: "Current template fails to showcase interactive property data and demographics to institutional investors.",
      proposedSolution: "Custom React/Next.js web application with interactive Mapbox integration, dark mode glassmorphism theme, and animated investment charts.",
      coldEmailSubject: "Scaling APEX Capital Realty's digital investment platform",
      coldEmailBody: "Hi Miguel,\n\nAs APEX Capital Realty expands its commercial footprint in Miami, your website is the crucial first touchpoint for major investors.\n\nWe build high-converting Next.js real estate platforms with sleek dark-mode aesthetics, custom interactive Mapbox property filters, and sub-second performance. You can view our premium work at http://eliteoperationglobal.com/.\n\nI'd love to share 3 quick UX tweaks that could boost your institutional lead conversion rate immediately. Are you available for a quick chat next Tuesday?\n\nBest,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "New Lead"
  },
  {
    id: "wd-005",
    name: "Goodhood",
    website: "https://goodhoodstore.com",
    domain: "goodhoodstore.com",
    email: "customerservice@goodhood.co.uk",
    phone: "+44 20 7729 3600",
    country: "UNITED_KINGDOM",
    state: "England",
    city: "London",
    industry: "Retail & Streetwear",
    projectType: "Web App Portal",
    estimatedBudget: 41500,
    urgency: "CRITICAL",
    currentStack: ["Shopify", "React", "Legacy API integrations"],
    recommendedStack: ["Next.js 14 App Router", "Tailwind CSS", "Vercel Edge", "Algolia Search"],
    audit: {
      performanceScore: 39,
      seoScore: 48,
      mobileScore: 30,
      securityScore: 70,
      loadTimeSeconds: 5.1,
      issuesCount: 16,
      topIssue: "Heavy JavaScript payloads and image unoptimization leading to sluggish mobile product discovery."
    },
    decisionMaker: {
      name: "Kyle Stewart",
      title: "Co-Founder",
      email: "kyle@goodhood.co.uk",
      phone: "+44 20 7729 3601",
      linkedin: "https://linkedin.com/in/kylestewart-london"
    },
    buyingSignal: "Cult-status streetwear store needing enterprise-level performance for exclusive product drops",
    detectedAt: "3 hours ago",
    aiPitch: {
      headline: "Edge-Rendered Headless Commerce Architecture for Goodhood",
      painPoint: "High-traffic sneaker/apparel drops causing site slowdowns and frustrating mobile shoppers.",
      proposedSolution: "Modern edge-rendered Next.js web application with real-time inventory syncing, instant Algolia search, and optimized media delivery.",
      coldEmailSubject: "Fixing Goodhood's mobile load times for the next big drop",
      coldEmailBody: "Hi Kyle,\n\nI'm a huge fan of Goodhood's curation. I reviewed the site and noticed that during peak traffic drops, mobile performance degrades, creating friction for loyal customers.\n\nWe build custom edge-rendered Next.js headless e-commerce platforms for cult retail brands, ensuring zero latency during high-demand product drops and instant search capabilities. Discover our tech capabilities at http://eliteoperationglobal.com/.\n\nCan we schedule a short video call to discuss optimizing your architecture before Q4?\n\nBest regards,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "Audit Generated"
  },
  {
    id: "wd-006",
    name: "Toothlife Studios",
    website: "https://toothlifestudios.ca",
    domain: "toothlifestudios.ca",
    email: "hello@toothlifestudios.ca",
    phone: "+1 (416) 698-9697",
    country: "CANADA",
    state: "Ontario",
    city: "Toronto",
    industry: "Healthcare & Dental Hygiene",
    projectType: "WordPress Migration",
    estimatedBudget: 24000,
    urgency: "MEDIUM",
    currentStack: ["Squarespace", "Basic Contact Form", "No Custom Analytics"],
    recommendedStack: ["Next.js 14", "Tailwind CSS", "Typeform / Cal.com API", "Vercel Analytics"],
    audit: {
      performanceScore: 52,
      seoScore: 68,
      mobileScore: 55,
      securityScore: 82,
      loadTimeSeconds: 3.8,
      issuesCount: 8,
      topIssue: "Generic builder layout degrades the highly-curated boutique brand aesthetic and lacks bespoke scheduling."
    },
    decisionMaker: {
      name: "Irene Iancu",
      title: "Founder & Registered Dental Hygienist",
      email: "irene@toothlifestudios.ca",
      phone: "+1 (416) 698-9697",
      linkedin: "https://linkedin.com/in/ireneiancu-toronto"
    },
    buyingSignal: "Rapidly growing brand and podcast presence needing a bespoke web platform",
    detectedAt: "6 hours ago",
    aiPitch: {
      headline: "Bespoke Boutique Dental Hygiene Digital Platform & Automation",
      painPoint: "Current template lacks the unique vibrant branding Toothlife is known for and fails to convert premium leads effectively.",
      proposedSolution: "High-end custom website engineered on Next.js with secure client intake, immersive brand video backgrounds, and automated consultation scheduling.",
      coldEmailSubject: "Elevating Toothlife Studios' digital presence & booking flow",
      coldEmailBody: "Hi Irene,\n\nI love what you've built with Toothlife Studios and the podcast! Your brand's reputation in Toronto is stellar, but your current website platform restricts the vibrant, premium aesthetic your studio embodies.\n\nWe engineer custom, highly secure web platforms for top-tier health boutiques, integrating automated lead qualification and instant, seamless booking. See how we elevate professional brands at http://eliteoperationglobal.com/.\n\nI'd welcome the chance to share a bespoke mock redesign tailored specifically for Toothlife. Let me know if you have time for a brief call next week.\n\nSincerely,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "New Lead"
  },
  {
    id: "wd-007",
    name: "Spicers Balfour Hotel",
    website: "https://spicersretreats.com/retreats/spicers-balfour-hotel",
    domain: "spicersretreats.com",
    email: "balfour@spicersretreats.com",
    phone: "+61 1300 597 540",
    country: "AUSTRALIA",
    state: "Queensland",
    city: "Brisbane",
    industry: "Hospitality & Boutique Hotels",
    projectType: "UI/UX Redesign",
    estimatedBudget: 32000,
    urgency: "HIGH",
    currentStack: ["Corporate CMS", "Legacy Booking Engine", "Unoptimized Media"],
    recommendedStack: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Cloudinary", "Vercel Edge"],
    audit: {
      performanceScore: 40,
      seoScore: 70,
      mobileScore: 50,
      securityScore: 55,
      loadTimeSeconds: 4.6,
      issuesCount: 13,
      topIssue: "Group CMS homogenizes the unique boutique identity of the Balfour property."
    },
    decisionMaker: {
      name: "David Assef",
      title: "Managing Director",
      email: "david.assef@spicersretreats.com",
      phone: "+61 1300 597 540",
      linkedin: "https://linkedin.com/in/davidassef-hospitality"
    },
    buyingSignal: "Need to differentiate the boutique urban property from rural retreats via standalone digital experience",
    detectedAt: "4 hours ago",
    aiPitch: {
      headline: "Immersive Standalone Digital Experience for Spicers Balfour",
      painPoint: "Being buried in a corporate multi-property CMS dilutes the unique urban luxury identity of the Balfour Hotel.",
      proposedSolution: "A standalone, ultra-fast Next.js interactive website for Balfour with immersive video hero sections and direct-booking API integration.",
      coldEmailSubject: "Elevating the digital footprint for Spicers Balfour",
      coldEmailBody: "Hi David,\n\nSpicers Balfour is an incredible property, but its digital presence is currently homogenized within the broader corporate CMS. To capture more direct weekend bookings in Brisbane, Balfour needs a bespoke, high-performance standalone site.\n\nWe build immersive hospitality sites on Next.js—achieving 100/100 Lighthouse scores, loading in under 400ms, and dramatically increasing direct room bookings. Learn more about our web solutions at http://eliteoperationglobal.com/.\n\nLet me know if you have 10 minutes this week for a brief walkthrough on how we can highlight Balfour's unique charm.\n\nBest,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "Contacted"
  },
  {
    id: "wd-008",
    name: "Miss Midgley's",
    website: "https://missmidgleys.com.au",
    domain: "missmidgleys.com.au",
    email: "hello@missmidgleys.com.au",
    phone: "+61 400 123 456",
    country: "AUSTRALIA",
    state: "Queensland",
    city: "Brisbane",
    industry: "Hospitality & Boutique Accommodation",
    projectType: "Next.js Rebuild",
    estimatedBudget: 31000,
    urgency: "HIGH",
    currentStack: ["Squarespace", "Basic Gallery", "External Booking Links"],
    recommendedStack: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Stripe API"],
    audit: {
      performanceScore: 36,
      seoScore: 59,
      mobileScore: 38,
      securityScore: 62,
      loadTimeSeconds: 5.3,
      issuesCount: 15,
      topIssue: "Non-responsive mobile booking flow resulting in lost weekend resort reservations."
    },
    decisionMaker: {
      name: "Lisa Midgley",
      title: "Owner & Developer",
      email: "lisa@missmidgleys.com.au",
      phone: "+61 400 123 456",
      linkedin: "https://linkedin.com/in/lisamidgley-brisbane"
    },
    buyingSignal: "Award-winning heritage redesign needing a digital experience that matches the physical architecture",
    detectedAt: "7 hours ago",
    aiPitch: {
      headline: "Award-Winning Digital Architecture for Miss Midgley's",
      painPoint: "Current template website doesn't match the incredible architectural pedigree and story of the physical property.",
      proposedSolution: "Custom React/Next.js multi-page app featuring cinematic video backgrounds, immersive room tours, and seamless direct booking checkout.",
      coldEmailSubject: "A digital experience that matches Miss Midgley's architecture",
      coldEmailBody: "Hi Lisa,\n\nMiss Midgley's physical transformation is stunning, but your current template website doesn't quite capture the luxury and history of the property. The current mobile experience is likely costing you direct booking revenue.\n\nWe specialize in luxury hospitality web design, delivering high-speed Next.js portals with immersive visual storytelling and seamless room reservation workflows. See our portfolio of stunning digital experiences at http://eliteoperationglobal.com/.\n\nI'd love to show you how we helped a boutique hotel increase direct bookings by 34%. Are you free for a brief chat on Thursday?\n\nCheers,\nEliteOps Dev Team\nhttp://eliteoperationglobal.com/"
    },
    status: "New Lead"
  }
];
