import { connectToDatabase } from '../config/database.js'; // Import the database connection function
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Define Mongoose schema and model for users
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  firstName: {
    type: String,
    required: [true, 'Firts name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    required: [true, 'Role is required']
  },
  createdAt: {
    type: String,
    required: [true, 'Created date is required']
  },
  address: {
    type: String,
    required: [true, 'Address year is required']
  }
});

const User = mongoose.model('User', userSchema);

// Get all users
const getAllUsers = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');
    const users = await collection.find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    res.status(500).json({ message: 'Error fetching books', error: err.toString() });
  }
};

// Get a single user by ID
const getSingleUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');
    const userId = new ObjectId(id);
    const user = await collection.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (err) {
    console.error('Error in getSingleUser:', err);
    res.status(500).json({ message: 'Error fetching user', error: err.toString() });
  }
};

// Create a new user
const createUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    // Validate with Mongoose before inserting
    const newUser = new User(req.body);
    const validationError = newUser.validateSync();

    if (validationError) {
      return res.status(400).json({ message: 'Validation failed', error: validationError.message });
    }

    const response = await collection.insertOne(req.body);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (err) {
    console.error('Error in createUser:', err);
    res.status(500).json({ message: 'Error creating user', error: err.toString() });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');
    const userId = new ObjectId(id);

    // Validate with Mongoose before updating
    const updatedUser = new User(req.body);
    const validationError = updatedUser.validateSync();

    if (validationError) {
      return res.status(400).json({ message: 'Validation failed', error: validationError.message });
    }

    const response = await collection.updateOne({ _id: userId }, { $set: req.body });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message:
        response.modifiedCount > 0
          ? 'User updated successfully'
          : 'No changes were made to the user',
      modifiedCount: response.modifiedCount
    });
  } catch (err) {
    console.error('Error in updateUser:', err);
    res.status(500).json({ message: 'Error updating user', error: err.toString() });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');
    const userId = new ObjectId(id);
    const response = await collection.deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error in deleteUser:', err);
    res.status(500).json({ message: 'Error deleting user', error: err.toString() });
  }
};

export default {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
};
