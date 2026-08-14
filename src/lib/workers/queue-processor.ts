import { Worker } from 'bullmq';
import { redisConnection } from './queue';
import { ConnectorManager } from '../connectors/manager';

console.log('[Worker] EliteOps Background Worker Process Starting...');

const connectorManager = new ConnectorManager();

// Worker 1: Lead Discovery Worker
const leadDiscoveryWorker = new Worker(
  'lead-discovery-queue',
  async (job) => {
    console.log(`[Worker Job ${job.id}] Executing lead discovery for source: ${job.data.sourceType}`);
    const discovered = await connectorManager.runEnabledConnectors();
    console.log(`[Worker Job ${job.id}] Successfully processed ${discovered.length} raw lead feeds.`);
    return { discoveredCount: discovered.length };
  },
  { connection: redisConnection }
);

leadDiscoveryWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

leadDiscoveryWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error:`, err);
});
