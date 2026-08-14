// EliteOps AI Cold Outreach Writer Engine
// Generates human-like, non-AI-sounding, high-converting outreach copy

export interface OutreachWriterInput {
  companyName: string;
  contactName: string;
  contactTitle: string;
  industry: string;
  country: string;
  primaryPainPoint: string;
  recommendedService: string;
  auditedMetric?: string;
}

export interface OutreachSequence {
  pitchAngle: string;
  coldEmail: string;
  followUp1: string;
  followUp2: string;
  linkedInMessage: string;
  callScript: string;
}

export function generateOutreachSequence(input: OutreachWriterInput): OutreachSequence {
  const name = input.contactName || 'there';
  const company = input.companyName;
  const issue = input.primaryPainPoint || 'website load speed and lead conversion rate';

  const coldEmail = `Subject: Quick note regarding ${company}'s ${issue.toLowerCase().includes('website') ? 'website' : 'growth'}

Hi ${name},

I was looking at ${company}'s online presence in ${input.country} today and noticed a small bottleneck that might be costing you sales—specifically around ${issue}.

At EliteOps Global, we specialize in helping ${input.industry} firms fix these friction points quickly through high-performance ${input.recommendedService}.

We recently helped a similar company boost their conversions by 42% in under 30 days without breaking their budget.

Would you be open to a 5-minute quick review of what we found? I can send over a 2-minute video tear-down if easier.

Best regards,

EliteOps Growth Team
EliteOps Global
`;

  const followUp1 = `Subject: Re: Quick note regarding ${company}

Hi ${name},

Following up on my previous message. I know things get busy running ${company}.

I compiled a brief tear-down detailing how fixing ${issue} could directly increase your monthly lead volume. 

Worth a quick 4-minute glance this week?

Best,

EliteOps Growth Team
`;

  const followUp2 = `Subject: Closing the loop / ${company}

Hi ${name},

I haven't heard back, so I assume addressing ${issue} isn't a top priority for ${company} right now—and that's completely fine.

If anything changes down the road, feel free to reach out anytime at EliteOps Global.

Wishing you and the team continued success!

Best,

EliteOps Growth Team
`;

  const linkedInMessage = `Hi ${name}, saw ${company}'s work in ${input.country}. Noticed an easy win regarding your ${issue}. We handle ${input.recommendedService} for growing ${input.industry} brands. Open to connecting?`;

  const callScript = `[Cold Call Script for ${company}]
Caller: "Hi ${name}, this is EliteOps calling regarding ${company}'s digital growth in ${input.country}. Did I catch you at a terrible time?"

[If Open]:
Caller: "I'm calling because our research team flagged a specific opportunity on your ${company} site regarding ${issue}. We specialize in ${input.recommendedService} for ${input.industry} companies. We usually help cut tech overhead by 40-60%. Are you the best person to speak with about tech & marketing operations?"

[Objection Handling - 'Send an email']:
Caller: "Happy to! What's the best direct email address, and I'll send over the 2-minute video audit we put together for your team."
`;

  return {
    pitchAngle: `Direct Audit Focus: ${issue}`,
    coldEmail,
    followUp1,
    followUp2,
    linkedInMessage,
    callScript,
  };
}
