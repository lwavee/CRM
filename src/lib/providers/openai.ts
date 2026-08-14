// Provider Adapter: OpenAI API (GPT-4o Classification, Opportunity Scoring & Insight Synthesis)
import OpenAI from 'openai';

export type AgencyClassificationType =
  | 'AGENCY'
  | 'BROKERAGE'
  | 'CARRIER'
  | 'ASSOCIATION'
  | 'GOVERNMENT'
  | 'DIRECTORY'
  | 'UNKNOWN';

export interface AgencyScoreResult {
  opportunityScore: number;
  qualityScore: number;
  agencyFitScore: number;
  leadInsight: string;
  recommendedService: 'WEBSITE_DEVELOPMENT' | 'DIGITAL_MARKETING' | 'BACK_OFFICE_SUPPORT' | 'VIRTUAL_ASSISTANT' | 'AUTOMATION' | 'AI_SOLUTIONS';
}

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function classifyInsuranceBusiness(
  businessName: string,
  snippet: string = '',
  domain: string = ''
): Promise<{ classification: AgencyClassificationType; confidence: number; reasoning: string }> {
  const openai = getOpenAIClient();

  // Fast heuristic rule fallback if OpenAI API key is missing or fails
  const nameLower = businessName.toLowerCase();

  // Carriers to reject immediately
  if (
    nameLower.includes('blue cross') ||
    nameLower.includes('state farm insurance group') ||
    nameLower.includes('geico') ||
    nameLower.includes('allstate corporation') ||
    nameLower.includes('progressive corporation') ||
    nameLower.includes('liberty mutual') ||
    nameLower.includes('kaiser permanente') ||
    nameLower.includes('manulife') ||
    nameLower.includes('sun life') ||
    nameLower.includes('intact financial') ||
    nameLower.includes('desjardins')
  ) {
    return {
      classification: 'CARRIER',
      confidence: 0.98,
      reasoning: 'Matches major national underwriter corporate brand name',
    };
  }

  if (
    nameLower.includes('department of insurance') ||
    nameLower.includes('insurance commissioner') ||
    nameLower.includes('state fund')
  ) {
    return {
      classification: 'GOVERNMENT',
      confidence: 0.98,
      reasoning: 'Matches government regulator or state fund',
    };
  }

  if (
    nameLower.includes('insurance association') ||
    nameLower.includes('bureau of insurance') ||
    nameLower.includes('insurance institute')
  ) {
    return {
      classification: 'ASSOCIATION',
      confidence: 0.95,
      reasoning: 'Matches insurance trade association or institute',
    };
  }

  if (
    nameLower.includes('agency') ||
    nameLower.includes('agencies') ||
    nameLower.includes('broker') ||
    nameLower.includes('brokers') ||
    nameLower.includes('brokerage') ||
    nameLower.includes('associates') ||
    nameLower.includes('services') ||
    nameLower.includes('advisors')
  ) {
    return {
      classification: nameLower.includes('broker') ? 'BROKERAGE' : 'AGENCY',
      confidence: 0.92,
      reasoning: 'Contains clear agency/brokerage operational keyword',
    };
  }

  if (!openai) {
    return {
      classification: 'AGENCY',
      confidence: 0.75,
      reasoning: 'Rule-based default for localized commercial insurance provider',
    };
  }

  try {
    const prompt = `Classify this insurance business into ONE of these exact categories:
- AGENCY (Independent insurance agency, local commercial agency)
- BROKERAGE (Commercial insurance brokerage, employee benefits broker)
- CARRIER (Insurance carrier, underwriter, insurance company corporation like Blue Cross, Geico)
- ASSOCIATION (Trade association, insurance council)
- GOVERNMENT (Government insurance department, state fund, regulator)
- DIRECTORY (Directory, listing website like Yelp, YellowPages)
- UNKNOWN

Business Name: "${businessName}"
Domain: "${domain}"
Snippet/Description: "${snippet}"

Respond in JSON format: {"classification": "AGENCY"|"BROKERAGE"|"CARRIER"|"ASSOCIATION"|"GOVERNMENT"|"DIRECTORY"|"UNKNOWN", "confidence": 0.0-1.0, "reasoning": "short explanation"}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      classification: parsed.classification || 'AGENCY',
      confidence: parsed.confidence || 0.8,
      reasoning: parsed.reasoning || 'AI analysis',
    };
  } catch (err: any) {
    return {
      classification: 'AGENCY',
      confidence: 0.7,
      reasoning: `AI classification fallback: ${err.message}`,
    };
  }
}

export async function scoreAgencyLeadOpportunity(
  agencyName: string,
  category: string,
  city: string,
  state: string,
  rating: number = 4.5,
  reviewsCount: number = 20,
  hasWebsite: boolean = true,
  hasVerifiedEmail: boolean = false,
  hasDecisionMaker: boolean = false
): Promise<AgencyScoreResult> {
  // Deterministic Base Scoring
  let qualityScore = 60;
  let opportunityScore = 65;
  let agencyFitScore = 75;

  if (hasWebsite) qualityScore += 10;
  if (hasVerifiedEmail) {
    qualityScore += 15;
    opportunityScore += 10;
  }
  if (hasDecisionMaker) {
    qualityScore += 15;
    agencyFitScore += 10;
  }

  if (reviewsCount > 50) qualityScore += 5;
  if (rating >= 4.7) qualityScore += 5;

  qualityScore = Math.min(Math.max(qualityScore, 40), 98);
  opportunityScore = Math.min(Math.max(opportunityScore, 50), 95);
  agencyFitScore = Math.min(Math.max(agencyFitScore, 55), 96);

  const defaultInsight = `${agencyName} is an established independent insurance agency in ${city}, ${state} (${rating}★ from ${reviewsCount} reviews). Prime prospect for EliteOps website modernization, local SEO, and back-office automation.`;

  const openai = getOpenAIClient();
  if (!openai) {
    return {
      opportunityScore,
      qualityScore,
      agencyFitScore,
      leadInsight: defaultInsight,
      recommendedService: 'WEBSITE_DEVELOPMENT',
    };
  }

  try {
    const prompt = `Analyze this B2B lead for EliteOps Global (agency offering Web Dev, Local SEO, AI Automation, VAs):
Agency: "${agencyName}"
Location: ${city}, ${state}
Line: ${category}
Rating: ${rating} (${reviewsCount} reviews)
Has Email: ${hasVerifiedEmail}
Has Executive Contact: ${hasDecisionMaker}

Generate a concise 2-sentence rationale ("leadInsight") explaining why this agency is a strong candidate for EliteOps services based strictly on the provided data.
Select ONE recommended service from: WEBSITE_DEVELOPMENT, DIGITAL_MARKETING, BACK_OFFICE_SUPPORT, VIRTUAL_ASSISTANT, AUTOMATION, AI_SOLUTIONS.

Return JSON format:
{
  "leadInsight": "2-sentence rationale",
  "recommendedService": "WEBSITE_DEVELOPMENT"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      opportunityScore,
      qualityScore,
      agencyFitScore,
      leadInsight: parsed.leadInsight || defaultInsight,
      recommendedService: parsed.recommendedService || 'WEBSITE_DEVELOPMENT',
    };
  } catch (err) {
    return {
      opportunityScore,
      qualityScore,
      agencyFitScore,
      leadInsight: defaultInsight,
      recommendedService: 'WEBSITE_DEVELOPMENT',
    };
  }
}
