import mongoose from 'mongoose'; // Mongoose model for Review

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    bookId: {
      type: String,
      required: [true, 'Book ID is required'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating cannot be negative']
    },
    comment: {
      type: Number,
      required: [true, 'Published year is required'],
      min: [0, 'Published year cannot be negative']
    },
    reviewDate: {
      type: String,
      required: [true, 'Review date is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
); // Mongoose model for Review

const Review = mongoose.model('Review', reviewSchema); // Mongoose model for Review

export default Review; // Mongoose model for Review
