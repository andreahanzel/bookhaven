import { connectToDatabase } from '../config/database.js'; // Import the database connection function
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Define Mongoose schema and model for reviews
const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  bookId: {
    type: String,
    required: [true, 'Book ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required']
  },
  comment: {
    type: String,
    required: [true, 'A Comment is required']
  },
  reviewDate: {
    type: String,
    required: [true, 'Review Date is required']
  }
});

const Review = mongoose.model('Review', reviewSchema);

// Get all reviews
const getAllReviews = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const db = await connectToDatabase();
    const collection = db.collection('reviews');
    const reviews = await collection.find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error in getallReviews:', err);
    res.status(500).json({ message: 'Error fetching reviews', error: err.toString() });
  }
};

// Get a single review by ID
const getSingleReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('reviews');
    const reviewId = new ObjectId(id);
    const review = await collection.findOne({ _id: reviewId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(review);
  } catch (err) {
    console.error('Error in getSingleReview:', err);
    res.status(500).json({ message: 'Error fetching review', error: err.toString() });
  }
};

// Create a new review
const createReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const db = await connectToDatabase();
    const collection = db.collection('reviews');

    // Validate with Mongoose before inserting
    const newReview = new Review(req.body);
    const validationError = newReview.validateSync();

    if (validationError) {
      return res.status(400).json({ message: 'Validation failed', error: validationError.message });
    }

    const response = await collection.insertOne(req.body);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create review' });
    }
  } catch (err) {
    console.error('Error in createReview:', err);
    res.status(500).json({ message: 'Error creating review', error: err.toString() });
  }
};

// Update a review by ID
const updateReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('reviews');
    const reviewId = new ObjectId(id);

    // Validate with Mongoose before updating
    const updatedReview = new Review(req.body);
    const validationError = updatedReview.validateSync();

    if (validationError) {
      return res.status(400).json({ message: 'Validation failed', error: validationError.message });
    }

    const response = await collection.updateOne({ _id: reviewId }, { $set: req.body });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message:
        response.modifiedCount > 0
          ? 'Review updated successfully'
          : 'No changes were made to the review',
      modifiedCount: response.modifiedCount
    });
  } catch (err) {
    console.error('Error in updateReview:', err);
    res.status(500).json({ message: 'Error updating review', error: err.toString() });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('reviews');
    const reviewId = new ObjectId(id);
    const response = await collection.deleteOne({ _id: reviewId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Review not found' });
    }
  } catch (err) {
    console.error('Error in deleteReview:', err);
    res.status(500).json({ message: 'Error deleting review', error: err.toString() });
  }
};

export default {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview
};
