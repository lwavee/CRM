import { PrismaClient } from '@prisma/client';
import { INITIAL_LEADS } from '../src/lib/data/mock-db';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EliteOps Lead Intelligence Platform Database...');

  for (const lead of INITIAL_LEADS) {
    const createdCompany = await prisma.company.upsert({
      where: { domain: lead.domain },
      update: {},
      create: {
        id: lead.id,
        name: lead.name,
        website: lead.website,
        domain: lead.domain,
        industry: lead.industry,
        employeeCount: lead.employeeCount,
        employeeRange: lead.employeeRange,
        estimatedRevenue: 4500000,
        country: lead.country,
        state: lead.state,
        city: lead.city,
        googleMapsUrl: lead.googleMapsUrl,
        googleRating: lead.googleRating,
        googleReviewsCount: lead.googleReviewsCount,
        technologies: lead.technologies,
        socialProfiles: lead.socialProfiles,
        status: lead.status,
        recommendedService: lead.recommendedService,
        estimatedDealValue: lead.estimatedDealValue,
        opportunityScore: lead.opportunityScore,
        buyingIntentScore: lead.buyingIntentScore,
        agencyFitScore: lead.agencyFitScore,
      },
    });

    console.log(`Seeded company: ${createdCompany.name}`);
  }

  // Seed default connectors
  const connectors = [
    { name: 'Google Maps Business Intelligence', connectorType: 'GOOGLE_MAPS', isEnabled: true },
    { name: 'Job Board Intent Radar', connectorType: 'JOB_BOARD', isEnabled: true },
    { name: 'Crunchbase Funding Feed', connectorType: 'CRUNCHBASE', isEnabled: true },
    { name: 'Apollo Lead Feed', connectorType: 'APOLLO_FEED', isEnabled: true },
  ];

  for (const conn of connectors) {
    await prisma.connectorConfig.upsert({
      where: { name: conn.name },
      update: {},
      create: conn,
    });
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
