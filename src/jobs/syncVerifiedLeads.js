const cron = require('node-cron');
const Lead = require('../models/Lead');

async function runSyncJobOnce() {
  try {
    const leadsToSync = await Lead.find({
      status: 'Verified',
      syncedToCRM: false
    }).limit(100);

    for (const lead of leadsToSync) {
      console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);

      // Mark as synced to ensure idempotency
      lead.syncedToCRM = true;
      lead.syncedAt = new Date();
      await lead.save();
    }
  } catch (error) {
    console.error('Error running CRM sync job:', error);
  }
}

function startSyncCron() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running scheduled CRM sync job...');
    await runSyncJobOnce();
  });

  console.log('CRM sync cron job scheduled to run every 5 minutes');
}

module.exports = startSyncCron;


