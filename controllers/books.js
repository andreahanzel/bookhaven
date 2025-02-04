import { connectToDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Define Mongoose schema and model for books
const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: [true, 'Book ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required']
  },
  publishedYear: {
    type: Number,
    required: [true, 'Published year is required']
  }
});

const Book = mongoose.model('Book', bookSchema);

// Get all books
const getAllBooks = async (req, res) => {
  //#swagger.tags = ['Books']
  try {
    const db = await connectToDatabase();
    const collection = db.collection('books');
    const books = await collection.find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  } catch (err) {
    console.error('Error in getAllBooks:', err);
    res.status(500).json({ message: 'Error fetching books', error: err.toString() });
  }
};

// Get a single book by ID
const getSingleBook = async (req, res) => {
  //#swagger.tags = ['Books']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('books');
    const bookId = new ObjectId(id);
    const book = await collection.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(book);
  } catch (err) {
    console.error('Error in getSingleBook:', err);
    res.status(500).json({ message: 'Error fetching book', error: err.toString() });
  }
};

// Create a new book
const createBook = async (req, res) => {
  //#swagger.tags = ['Books']
  try {
    const db = await connectToDatabase();
    const collection = db.collection('books');

    // Validate with Mongoose before inserting
    const newBook = new Book(req.body);
    const validationError = newBook.validateSync();

    if (validationError) {
      return res.status(400).json({ message: 'Validation failed', error: validationError.message });
    }

    const response = await collection.insertOne(req.body);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create book' });
    }
  } catch (err) {
    console.error('Error in createBook:', err);
    res.status(500).json({ message: 'Error creating book', error: err.toString() });
  }
};

// Update a book by ID
const updateBook = async (req, res) => {
  //#swagger.tags = ['Books']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('books');
    const bookId = new ObjectId(id);

    // Validate with Mongoose before updating
    const updatedBook = new Book(req.body);
    const validationError = updatedBook.validateSync();

    if (validationError) {
      return res.status(400).json({ message: 'Validation failed', error: validationError.message });
    }

    const response = await collection.updateOne({ _id: bookId }, { $set: req.body });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({
      message:
        response.modifiedCount > 0
          ? 'Book updated successfully'
          : 'No changes were made to the book',
      modifiedCount: response.modifiedCount
    });
  } catch (err) {
    console.error('Error in updateBook:', err);
    res.status(500).json({ message: 'Error updating book', error: err.toString() });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  //#swagger.tags = ['Books']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('books');
    const bookId = new ObjectId(id);
    const response = await collection.deleteOne({ _id: bookId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    console.error('Error in deleteBook:', err);
    res.status(500).json({ message: 'Error deleting book', error: err.toString() });
  }
};

export default {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook
};
