import { jest } from '@jest/globals'; // Import jest for mocking
import ordersController from '../../controllers/orders.js'; // Import the orders controller

// Mock the database connection
jest.mock('../../config/database.js', () => ({
  connectToDatabase: jest.fn().mockResolvedValue({
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn()
      }),
      findOne: jest.fn() // Added this mock
    })
  })
}));
// Mock the Order model
describe('Order Controller Unit Tests', () => {
  let mockOrders;
  let mockDbConnection;

  beforeEach(() => {
    mockOrders = [
      {
        _id: '67a1238897f9f01aac2a9e60',
        userId: 'U001',
        bookId: 'B001',
        quantity: 2,
        totalPrice: 21.98,
        orderDate: '2025-02-03',
        status: 'Processing',
        shippingAddress: '123 Elm St, Springfield, IL'
      }
    ];

    // Setup mock database connection
    mockDbConnection = {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockOrders)
        }),
        findOne: jest.fn().mockResolvedValue(mockOrders[0]) // Added this mock
      })
    };

    const { connectToDatabase } = require('../../config/database.js');
    connectToDatabase.mockResolvedValue(mockDbConnection);
  });
  // Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // TEST: GET ALL ORDERS
  test('should return all orders', async () => {
    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await ordersController.getAllOrders(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  // TEST: GET SINGLE ORDER
  test('should return a single order when valid ID is provided', async () => {
    const req = {
      params: { id: '67a1238897f9f01aac2a9e60' }
    };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await ordersController.getSingleOrder(req, res);
    expect(res.json).toHaveBeenCalledWith(mockOrders[0]);
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
