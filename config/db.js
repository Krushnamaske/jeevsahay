const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      '⚠️  MONGO_URI is not set. Auth/Directory features that need the database will not work.\n' +
      '   Add MONGO_URI to your .env file (see .env.example).'
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't crash the whole server (static pages should still load),
    // but auth/directory routes will fail until this is fixed.
  }
};

module.exports = connectDB;
