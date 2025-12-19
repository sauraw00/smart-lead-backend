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

// Routes
app.use('/api/leads', leadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server after DB connection
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
      // Start background cron job
      startSyncCron();
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });


