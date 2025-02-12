// Project: @types/mongoose
import mongoose from 'mongoose';

// Clear the in-memory database
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

// Close the in-memory database
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

// Connect to the in-memory database
export const connectDatabase = async (mongoServer) => {
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};
