import mongoose from 'mongoose'; // Mongoose model for User

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true
    },
    password: {
      type: Number,
      required: [true, 'Password is required']
    },
    role: {
      type: Number,
      required: [true, 'Role is required']
    },
    createdAt: {
      type: Number,
      required: [true, 'Creation date is required']
    },
    address: {
      type: Number,
      required: [true, 'Address date is required']
    }
  },
  {
    timestamps: true
  }
); // Mongoose model for User

const User = mongoose.model('User', userSchema);

export default User; // Mongoose model for User
