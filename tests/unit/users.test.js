import { jest } from '@jest/globals'; // Import jest for mocking
import usersController from '../../controllers/users.js'; // Import the users controller

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
// Mock the User model
describe('User Controller Unit Tests', () => {
  let mockUsers;
  let mockDbConnection;

  beforeEach(() => {
    mockUsers = [
      {
        _id: '67a1235d97f9f01aac2a9e59',
        userId: 'U001',
        firstName: 'Johny',
        lastName: 'Deep',
        email: 'johndoe@example.com',
        password: 'hashedpassword123',
        role: 'customer',
        createdAt: '2025-01-10',
        address: '123 Elm St, Springfield, IL'
      }
    ];
    // Setup mock database connection
    mockDbConnection = {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockUsers)
        }),
        findOne: jest.fn().mockResolvedValue(mockUsers[0])
      })
    };

    const { connectToDatabase } = require('../../config/database.js');
    connectToDatabase.mockResolvedValue(mockDbConnection);
  });
  // Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // TEST: GET ALL USERS
  test('should return all users', async () => {
    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await usersController.getAllUsers(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
  // TEST: GET SINGLE USER
  test('should return a single user when valid ID is provided', async () => {
    const req = {
      params: { id: '67a1235d97f9f01aac2a9e59' }
    };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await usersController.getSingleUser(req, res);
    expect(res.json).toHaveBeenCalledWith(mockUsers[0]);
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
