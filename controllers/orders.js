import { connectToDatabase } from '../config/database.js'; // Import the database connection function
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Define Mongoose schema and model for orders
const orderSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: [true, 'User ID is required']
    },
    bookId: {
      type: String,
      required: [true, 'Book ID is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total Price is required']
    },
    orderDate: {
      type: String,
      required: [true, 'Order date is required']
    },
    status: {
      type: String,
      required: [true, 'Status is required']
    },
    shippingAddress: {
      type: String,
      required: [true, 'Shipping Address is required']
    }
  });
  
  const Order = mongoose.model('Order', orderSchema);

 // Get all orders
const getAllOrders = async (req, res) => {
    //#swagger.tags = ['Orders']
    try {
      const db = await connectToDatabase();
      const collection = db.collection('orders');
      const orders = await collection.find().toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(orders);
    } catch (err) {
      console.error('Error in getAllOrders:', err);
      res.status(500).json({ message: 'Error fetching orders', error: err.toString() });
    }
  }; 

  // Get a single order by ID
const getSingleOrder = async (req, res) => {
    //#swagger.tags = ['Orders']
    try {
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const db = await connectToDatabase();
      const collection = db.collection('orders');
      const orderId = new ObjectId(id);
      const order = await collection.findOne({ _id: orderId });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(order);
    } catch (err) {
      console.error('Error in getSingleOrder:', err);
      res.status(500).json({ message: 'Error fetching order', error: err.toString() });
    }
  };
  
  // Create a new order
  const createOrder = async (req, res) => {
    //#swagger.tags = ['Orders']
    try {
      const db = await connectToDatabase();
      const collection = db.collection('orders');
  
      // Validate with Mongoose before inserting
      const newOrder = new Order(req.body);
      const validationError = newOrder.validateSync();
  
      if (validationError) {
        return res.status(400).json({ message: 'Validation failed', error: validationError.message });
      }
  
      const response = await collection.insertOne(req.body);
  
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json({ message: 'Failed to create order' });
      }
    } catch (err) {
      console.error('Error in createOrder:', err);
      res.status(500).json({ message: 'Error creating order', error: err.toString() });
    }
  };
  
  // Update a order by ID
  const updateOrder = async (req, res) => {
    //#swagger.tags = ['Orders']
    try {
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const db = await connectToDatabase();
      const collection = db.collection('orders');
      const orderId = new ObjectId(id);
  
      // Validate with Mongoose before updating
      const updatedOrder = new Order(req.body);
      const validationError = updatedOrder.validateSync();
  
      if (validationError) {
        return res.status(400).json({ message: 'Validation failed', error: validationError.message });
      }
  
      const response = await collection.updateOne({ _id: orderId }, { $set: req.body });
  
      if (response.matchedCount === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({
        message:
          response.modifiedCount > 0
            ? 'Order updated successfully'
            : 'No changes were made to the order',
        modifiedCount: response.modifiedCount
      });
    } catch (err) {
      console.error('Error in updateOrder:', err);
      res.status(500).json({ message: 'Error updating order', error: err.toString() });
    }
  };
  
  // Delete a order by ID
  const deleteOrder = async (req, res) => {
    //#swagger.tags = ['Orders']
    try {
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const db = await connectToDatabase();
      const collection = db.collection('orders');
      const orderId = new ObjectId(id);
      const response = await collection.deleteOne({ _id: orderId });
  
      if (response.deletedCount > 0) {
        res.status(200).json({ message: 'Order deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    } catch (err) {
      console.error('Error in deleteOrder:', err);
      res.status(500).json({ message: 'Error deleting order', error: err.toString() });
    }
  };
  
  export default {
    getAllOrders,
    getSingleOrder,
    createOrder,
    updateOrder,
    deleteOrder
  };
  