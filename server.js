const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./src/config/db');
const leadRoutes = require('./src/routes/leadRoutes');
const startSyncCron = require('./src/jobs/syncVerifiedLeads');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/leads', leadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Check if running in Vercel serverless environment
const isVercel = process.env.VERCEL === '1';

// For local development: start server with DB connection and cron job
if (!isVercel) {
  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
        // Start background cron job (only in non-serverless environments)
        startSyncCron();
      });
    })
    .catch((err) => {
      console.error('Failed to connect to database', err);
      process.exit(1);
    });
}

// Export app for Vercel serverless functions
// This must be at the end and always exported
module.exports = app;


