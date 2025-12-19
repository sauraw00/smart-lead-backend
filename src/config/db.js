const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_lead_db';

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: true
  });

  console.log('Connected to MongoDB');
}

module.exports = connectDb;


