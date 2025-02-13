import mongoose from 'mongoose'; // Import mongoose
import { MongoMemoryServer } from 'mongodb-memory-server'; // Import MongoMemoryServer
import Book from '../../models/book.js'; // Import Book model
import Order from '../../models/order.js'; // Import Order model
import Review from '../../models/review.js'; // Import Review model
import User from '../../models/user.js'; // Import User model

let mongoServer; // In-memory MongoDB server

// Test Suite for MongoDB Collections
describe('MongoDB Collections Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Clear the database after each test
  afterEach(async () => {
    await Book.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
  });

  // Close the database connection after all tests
  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(); // Close the Mongoose connection
    }

    if (mongoServer) {
      await mongoServer.stop(); // Stop the in-memory server
    }

    jest.clearAllTimers(); // Clear any pending timers
    jest.useRealTimers();
  });

  // Test Cases for Books Collection
  describe('Books Collection', () => {
    it('should insert a book document', async () => {
      const mockBook = new Book({
        bookId: 'B001',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        price: 19.99,
        stock: 50,
        publishedYear: 1925
      });

      // Save the mock book to the database
      await mockBook.save();
      const insertedBook = await Book.findOne({ bookId: 'B001' });
      expect(insertedBook.bookId).toEqual(mockBook.bookId);
      expect(insertedBook.title).toEqual(mockBook.title);
    });
  });

  // Test Cases for Orders Collection
  describe('Orders Collection', () => {
    it('should insert an order document', async () => {
      const mockOrder = new Order({
        userId: 'U001',
        bookId: 'B001',
        quantity: 2,
        totalPrice: 39.98,
        orderDate: 20250203,
        status: 1,
        shippingAddress: 123
      });

      await mockOrder.save();
      const insertedOrder = await Order.findOne({ userId: 'U001' });
      expect(insertedOrder.userId).toEqual(mockOrder.userId);
      expect(insertedOrder.totalPrice).toEqual(mockOrder.totalPrice);
    });
  });

  // Test Cases for Reviews Collection
  describe('Reviews Collection', () => {
    it('should insert a review document', async () => {
      const mockReview = new Review({
        userId: 'U001',
        bookId: 'B001',
        rating: 5,
        comment: 500,
        reviewDate: '2025-02-03'
      });

      await mockReview.save();
      const insertedReview = await Review.findOne({ userId: 'U001', bookId: 'B001' });
      expect(insertedReview.rating).toEqual(mockReview.rating);
      expect(insertedReview.comment).toEqual(mockReview.comment);
    });
  });

  // Test Cases for Users Collection
  describe('Users Collection', () => {
    it('should insert a user document', async () => {
      const mockUser = new User({
        userId: 'U001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 12345,
        role: 1,
        createdAt: 20250203,
        address: 123
      });
      // Save the mock user to the database
      await mockUser.save();
      const insertedUser = await User.findOne({ userId: 'U001' });
      expect(insertedUser.firstName).toEqual(mockUser.firstName);
      expect(insertedUser.email).toEqual(mockUser.email);
    });
  });
});
