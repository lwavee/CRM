import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DealStage, ServiceCategory, SignalSeverity } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { leadData, enrichedData, aiScores } = await request.json();

    if (!leadData || !leadData.name) {
      return NextResponse.json({ error: 'Lead data is required' }, { status: 400 });
    }

    // Determine Country Enum based on input
    let countryEnum: any = 'USA';
    const rawCountry = leadData.country?.toUpperCase();
    if (['USA', 'CANADA', 'UNITED_KINGDOM', 'AUSTRALIA', 'UAE'].includes(rawCountry)) {
        countryEnum = rawCountry;
    }

    // Upsert the Company to avoid duplicates if running multiple scans
    const company = await prisma.company.upsert({
      where: { domain: leadData.domain },
      update: {
        googleRating: leadData.rating || 4.2,
        estimatedRevenue: enrichedData?.firmographics?.estimatedRevenue || 1000000,
        employeeCount: enrichedData?.firmographics?.employeeCount || 10,
        opportunityScore: aiScores?.opportunityScore || 75,
        agencyFitScore: aiScores?.agencyFitScore || 80,
      },
      create: {
        name: leadData.name,
        website: leadData.website || `https://${leadData.domain}`,
        domain: leadData.domain,
        industry: leadData.industry || 'Local Business',
        country: countryEnum,
        city: leadData.city || 'Unknown',
        googleRating: leadData.rating || 4.2,
        estimatedRevenue: enrichedData?.firmographics?.estimatedRevenue || 1000000,
        employeeCount: enrichedData?.firmographics?.employeeCount || 10,
        technologies: enrichedData?.firmographics?.technologies || ['WordPress'],
        status: DealStage.NEW,
        recommendedService: ServiceCategory.WEBSITE_DEVELOPMENT,
        opportunityScore: aiScores?.opportunityScore || 75,
        agencyFitScore: aiScores?.agencyFitScore || 80,
        buyingIntentScore: 85,
      }
    });

    // Save Decision Maker
    if (enrichedData?.decisionMaker) {
        await prisma.decisionMaker.create({
            data: {
                companyId: company.id,
                fullName: enrichedData.decisionMaker.name,
                jobTitle: enrichedData.decisionMaker.title,
                email: enrichedData.decisionMaker.email,
                phone: enrichedData.decisionMaker.phone,
                linkedInUrl: enrichedData.decisionMaker.linkedin,
                isPrimary: true
            }
        });
    }

    // Save Lead Score AI Reasoning
    if (aiScores) {
        await prisma.leadScore.create({
            data: {
                companyId: company.id,
                websiteQualityScore: aiScores.websiteQualityScore || 50,
                agencyFitScore: aiScores.agencyFitScore || 80,
                finalOpportunityScore: aiScores.opportunityScore || 75,
                aiReasoning: aiScores.aiReasoning || 'Processed by AI Scanner.',
            }
        });
    }

    // Save Website Audit mock for WebDev context
    await prisma.websiteAudit.create({
        data: {
            companyId: company.id,
            performanceScore: 35, // Typical low score for newly scanned unoptimized sites
            mobileScore: 40,
            loadTimeSeconds: 5.5,
            hasSsl: true,
        }
    });

    // Create a new Deal in the Pipeline
    await prisma.cRMDeal.create({
        data: {
            companyId: company.id,
            stage: DealStage.NEW,
            dealAmount: 25000,
            winProbability: 25,
            notes: `Auto-generated via Google Maps + Apollo/Hunter enrichment pipeline.`
        }
    });

    return NextResponse.json({
      success: true,
      company
    });

  } catch (error: any) {
    console.error('Error saving lead to CRM:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
