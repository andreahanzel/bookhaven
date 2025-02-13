import mongoose from 'mongoose'; // Import mongoose

// Close the in-memory database
export default async () => {
  if (mongoose.connection && mongoose.connection.readyState !== 0) {
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
  }
};
