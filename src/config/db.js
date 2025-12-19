const mongoose = require('mongoose');

let isConnected = false;

async function connectDb() {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb+srv://gujjarsaurav123:123@fileupload.vxfp99s.mongodb.net/?smart-leads retryWrites=true&w=majority&appName=myData'

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      autoIndex: true
    });

    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error
  }
}

module.exports = connectDb;


