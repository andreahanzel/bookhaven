import mongoose from 'mongoose'; // Mongoose model for Book

const bookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: [true, 'Book ID is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative']
    },
    publishedYear: {
      type: Number,
      required: [true, 'Published year is required'],
      min: [0, 'Published year cannot be negative']
    }
  },
  {
    timestamps: true
  }
); // Mongoose model for Book

const Book = mongoose.model('Book', bookSchema); // Mongoose model for Book

export default Book; // Mongoose model for Book
