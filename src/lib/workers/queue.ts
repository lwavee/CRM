// EliteOps BullMQ Worker & Redis Job Queue System
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const leadDiscoveryQueue = new Queue('lead-discovery-queue', {
  connection: redisConnection,
});

export const websiteAuditQueue = new Queue('website-audit-queue', {
  connection: redisConnection,
});

export const aiResearchQueue = new Queue('ai-research-queue', {
  connection: redisConnection,
});

export interface LeadDiscoveryJobPayload {
  connectorId: string;
  sourceType: string;
  maxLeads: number;
}

export interface WebsiteAuditJobPayload {
  companyId: string;
  websiteUrl: string;
}

export interface AIResearchJobPayload {
  companyId: string;
  generateOutreach: boolean;
}

// Queue Job Schedulers
export async function scheduleDailyLeadDiscovery() {
  await leadDiscoveryQueue.add(
    'daily-discovery-job',
    { connectorId: 'all', sourceType: 'AUTOMATED_CRON', maxLeads: 250 },
    {
      repeat: {
        pattern: '0 6 * * *', // Every morning at 6:00 AM
      } as any,
    }
  );
  console.log('[Queue] Daily lead discovery scheduled for 06:00 AM');
}
