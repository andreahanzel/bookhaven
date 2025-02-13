import { jest } from '@jest/globals'; // Import jest for mocking
import booksController from '../../controllers/books.js'; // Import the books controller

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
// Mock the Book model
describe('Book Controller Unit Tests', () => {
  let mockBooks;
  let mockDbConnection;

  beforeEach(() => {
    mockBooks = [
      {
        bookId: 'B001',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        price: 19.99,
        stock: 50,
        publishedYear: 1925
      }
    ];

    // Setup mock database connection
    mockDbConnection = {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockBooks)
        }),
        findOne: jest.fn().mockResolvedValue(mockBooks[0]) // Mocking findOne for getSingleBook
      })
    };

    const { connectToDatabase } = require('../../config/database.js');
    connectToDatabase.mockResolvedValue(mockDbConnection);
  });
  // Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks
  });
  // TEST: GET ALL BOOKS
  test('should return all books', async () => {
    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await booksController.getAllBooks(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  }, 10000);

  // TEST: GET SINGLE BOOK
  test('should return a single book when valid ID is provided', async () => {
    const req = {
      params: { id: '67a1238597f9f01aac2a9e58' } // Using the actual ObjectId from your data
    };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await booksController.getSingleBook(req, res);
    expect(res.json).toHaveBeenCalledWith(mockBooks[0]);
  }, 10000);

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
