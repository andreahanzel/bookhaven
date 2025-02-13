import { jest } from '@jest/globals'; // Import jest for mocking
import reviewsController from '../../controllers/reviews.js'; // Import the reviews controller

jest.setTimeout(10000); // Sets timeout to 10 seconds for all tests

// Mock the database connection
jest.mock('../../config/database.js', () => ({
  connectToDatabase: jest.fn().mockResolvedValue({
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn()
      }),
      findOne: jest.fn()
    })
  })
}));
// Mock the Review model
describe('Review Controller Unit Tests', () => {
  let mockReviews;
  let mockDbConnection;

  beforeEach(() => {
    mockReviews = [
      {
        _id: '67a123bd97f9f01aac2a9e68',
        userId: 'U001',
        bookId: 'B001',
        rating: 5,
        comment: 'An absolute masterpiece!',
        reviewDate: '2025-02-01'
      }
    ];
    // Setup mock database connection
    mockDbConnection = {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockReviews)
        }),
        findOne: jest.fn().mockResolvedValue(mockReviews[0])
      })
    };

    const { connectToDatabase } = require('../../config/database.js');
    connectToDatabase.mockResolvedValue(mockDbConnection);
  });
  // Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
  // TEST: GET ALL REVIEWS
  test('should return all reviews', async () => {
    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await reviewsController.getAllReviews(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.json).toHaveBeenCalledWith(mockReviews);
  });
  // TEST: GET SINGLE REVIEW
  test('should return a single review when valid ID is provided', async () => {
    const req = {
      params: { id: '67a123bd97f9f01aac2a9e68' }
    };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await reviewsController.getSingleReview(req, res);
    expect(res.json).toHaveBeenCalledWith(mockReviews[0]);
  });

  // Proper cleanup after all tests
  afterAll(async () => {
    jest.resetModules(); // Reset the module registry
    jest.restoreAllMocks(); // Restore all mocks

    // Explicitly close mock database connection if it exists
    if (mockDbConnection && typeof mockDbConnection.close === 'function') {
      await mockDbConnection.close();
    }

    // Clear any timers
    jest.clearAllTimers();
  });
});
