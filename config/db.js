const mongoose = require('mongoose');

const connectDB = async () => {
  // Support either variable name.
  // Render will use MONGO_URI.
  const mongoURI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('❌ MONGO_URI is not set.');
    console.error(
      'Add MONGO_URI to your environment variables.'
    );
    return;
  }

  try {
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error(
      '❌ MongoDB connection error:',
      error.message
    );
  }
};

module.exports = connectDB;