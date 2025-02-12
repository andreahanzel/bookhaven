import mongoose from 'mongoose'; // Import mongoose

// Import the teardown helper
afterAll(async () => {
  jest.resetModules(); // Reset module registry
  jest.restoreAllMocks(); // Restore all mocks

  // Close mock database connection if applicable
  if (mongoose.connection && mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  // Ensure mockDbConnection is fully closed
  if (global.mockDbConnection && typeof global.mockDbConnection.close === 'function') {
    await global.mockDbConnection.close();
  }

  // Clean up timers
  jest.clearAllTimers();
  jest.clearAllMocks();
  jest.useRealTimers();
});
