// EliteOps AI Lead Scoring Engine
// Multi-factor algorithm: 0 - 100 Lead Opportunity Score

export interface ScoringInput {
  websitePerformanceScore: number; // 0 - 100
  seoScore: number;                // 0 - 100
  mobileScore: number;             // 0 - 100
  loadTimeSeconds: number;
  hasSsl: boolean;
  brokenLinksCount: number;
  outdatedTech: boolean;
  hiringSignals: string[];         // e.g. ['HIRING_REACT_DEV', 'HIRING_SEO_EXPERT', 'HIRING_VA']
  isRecentlyFunded: boolean;
  googleRating: number;
  googleReviewsCount: number;
  employeeCount: number;
  country: string;
}

export interface DetailedScoreResult {
  websiteQualityScore: number;
  hiringIntentScore: number;
  agencyFitScore: number;
  seoScore: number;
  trustScore: number;
  buyingIntentScore: number;
  finalOpportunityScore: number;
  recommendedService: 'WEBSITE_DEVELOPMENT' | 'DIGITAL_MARKETING' | 'BACK_OFFICE_SUPPORT' | 'VIRTUAL_ASSISTANT' | 'AUTOMATION' | 'AI_SOLUTIONS';
  primaryPitchReason: string;
}

export function calculateLeadOpportunityScore(input: ScoringInput): DetailedScoreResult {
  // 1. Website Quality Penalty/Score (Lower web quality = Higher opportunity for agency!)
  let websiteNeedScore = 0;
  if (input.loadTimeSeconds > 3.0) websiteNeedScore += 25;
  if (input.websitePerformanceScore < 70) websiteNeedScore += 25;
  if (!input.hasSsl) websiteNeedScore += 20;
  if (input.outdatedTech) websiteNeedScore += 20;
  if (input.brokenLinksCount > 2) websiteNeedScore += 10;
  websiteNeedScore = Math.min(100, websiteNeedScore);

  // 2. Hiring & Buying Intent Score
  let hiringIntentScore = 40; // baseline
  const hiringCount = input.hiringSignals.length;
  hiringIntentScore += hiringCount * 15;
  if (input.isRecentlyFunded) hiringIntentScore += 20;
  hiringIntentScore = Math.min(100, hiringIntentScore);

  // 3. SEO Opportunity Score
  let seoNeedScore = 100 - input.seoScore;
  if (input.googleReviewsCount < 20 || input.googleRating < 4.0) {
    seoNeedScore += 20;
  }
  seoNeedScore = Math.min(100, seoNeedScore);

  // 4. Agency Fit Score (Target regions & team size)
  let agencyFitScore = 80; // Baseline high for target countries (USA, Canada, UK, Australia, UAE)
  if (['USA', 'CANADA', 'UNITED_KINGDOM', 'AUSTRALIA', 'UAE'].includes(input.country.toUpperCase())) {
    agencyFitScore += 15;
  }
  if (input.employeeCount >= 10 && input.employeeCount <= 250) {
    agencyFitScore += 10;
  }
  agencyFitScore = Math.min(100, agencyFitScore);

  // 5. Trust & Stability Score
  let trustScore = 70;
  if (input.googleRating >= 4.0) trustScore += 15;
  if (input.googleReviewsCount > 10) trustScore += 15;
  trustScore = Math.min(100, trustScore);

  // Weighted Final Opportunity Formula
  // High opportunity means high urgency/fit for EliteOps Global's services
  const finalOpportunityScore = Math.round(
    websiteNeedScore * 0.25 +
    hiringIntentScore * 0.25 +
    seoNeedScore * 0.20 +
    agencyFitScore * 0.20 +
    trustScore * 0.10
  );

  // Determine Recommended Service & Pitch Reason
  let recommendedService: DetailedScoreResult['recommendedService'] = 'WEBSITE_DEVELOPMENT';
  let primaryPitchReason = 'Website modernization and performance overhaul';

  if (input.hiringSignals.some(s => s.includes('VA') || s.includes('DATA_ENTRY') || s.includes('SUPPORT'))) {
    recommendedService = 'BACK_OFFICE_SUPPORT';
    primaryPitchReason = 'Offshore Back-Office & VA team scaling at 60% lower overhead';
  } else if (input.hiringSignals.some(s => s.includes('SEO') || s.includes('ADS')) || seoNeedScore > 75) {
    recommendedService = 'DIGITAL_MARKETING';
    primaryPitchReason = 'High-ROI SEO & Paid Ads growth accelerator';
  } else if (input.hiringSignals.some(s => s.includes('REACT') || s.includes('WORDPRESS') || s.includes('DEV')) || websiteNeedScore > 70) {
    recommendedService = 'WEBSITE_DEVELOPMENT';
    primaryPitchReason = 'Next.js & modern full-stack web redesign with instant load speed';
  } else if (input.hiringSignals.some(s => s.includes('OPS') || s.includes('AUTOMATION'))) {
    recommendedService = 'AUTOMATION';
    primaryPitchReason = 'Custom CRM & workflow automation pipelines';
  }

  return {
    websiteQualityScore: websiteNeedScore,
    hiringIntentScore,
    agencyFitScore,
    seoScore: input.seoScore,
    trustScore,
    buyingIntentScore: hiringIntentScore,
    finalOpportunityScore,
    recommendedService,
    primaryPitchReason,
  };
}
