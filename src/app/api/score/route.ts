import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const leadData = await request.json();

    if (!leadData || !leadData.name) {
      return NextResponse.json({ error: 'Lead data is required for scoring' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 });
    }

    const prompt = `
      You are an expert B2B Lead Scoring AI for a premium web development agency (EliteOps).
      Evaluate the following local business lead and return a JSON object with scores out of 100.
      
      LEAD DATA:
      Name: ${leadData.name}
      Industry: ${leadData.industry || 'Unknown'}
      Google Rating: ${leadData.rating || 'N/A'}
      Employee Count: ${leadData.firmographics?.employeeCount || 'Unknown'}
      Estimated Revenue: $${leadData.firmographics?.estimatedRevenue || 'Unknown'}
      
      Score based on:
      1. Business Size & Revenue (Larger = Better Agency Fit & Budget)
      2. Digital Presence (If they have poor reviews/rating but high revenue, they desperately need our help = High Opportunity)
      
      Provide your response strictly as a JSON object matching this schema:
      {
        "opportunityScore": (0-100 number),
        "agencyFitScore": (0-100 number),
        "websiteQualityScore": (0-100 number),
        "aiReasoning": "1-2 sentences explaining why this score was given based on the data provided."
      }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Using 3.5 for speed and low cost in high-volume scanning
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("OpenAI API Error:", errText);
        throw new Error("Failed to get AI score");
    }

    const jsonRes = await response.json();
    const resultContent = jsonRes.choices[0].message.content;
    const scores = JSON.parse(resultContent);

    return NextResponse.json({
      success: true,
      scores
    });

  } catch (error) {
    console.error('Error in /api/score:', error);
    // Provide fallback scores if AI fails
    return NextResponse.json({ 
        success: false,
        scores: {
            opportunityScore: 75,
            agencyFitScore: 80,
            websiteQualityScore: 50,
            aiReasoning: "Fallback scoring applied due to AI timeout."
        }
    });
  }
}
