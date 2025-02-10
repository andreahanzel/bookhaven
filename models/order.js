import mongoose from 'mongoose'; // Mongoose model for Order

const orderSchema = new mongoose.Schema(
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
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
      },
    totalPrice: {
    type: Number,
    required: [true, 'totalPrice is required'],
    min: [0, 'totalPrice cannot be negative']
    },
    orderDate: {
      type: Number,
      required: [true, 'Order date is required']
    },
    status: {
        type: Number,
        required: [true, 'Status is required']
      },
    shippingAddress: {
    type: Number,
    required: [true, 'Shioping address is required']
    }
  },
  {
    timestamps: true
  }
); // Mongoose model for Order

const Order = mongoose.model('Order', orderSchema); // Mongoose model for Order

export default Order; // Mongoose model for Order
