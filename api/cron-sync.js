const { runSyncJobOnce } = require('../src/jobs/syncVerifiedLeads');
const connectDb = require('../src/config/db');

module.exports = async (req, res) => {
  // Optional: Add authentication/authorization check here
  // For Vercel Cron, you can check for Authorization header
  // For now, allowing all requests (you can add auth later)
  
  try {
    // Ensure DB connection
    await connectDb();
    
    // Run sync job
    await runSyncJobOnce();
    
    res.json({ 
      success: true, 
      message: 'CRM sync job completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in cron sync job:', error);
    res.status(500).json({ 
      success: false, 
      message: 'CRM sync job failed',
      error: error.message 
    });
  }
};

