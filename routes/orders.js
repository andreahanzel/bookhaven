import express from 'express'; // Import express
import ordersController from '../controllers/orders.js'; // Import the orders controller
import { orderValidationRules, validate } from '../middleware/validation.js'; // Import validation rules and middleware
import BaseError from '../helpers/baseError.js'; // Import BaseError for error handling
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router(); // Create a new router instance

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve all orders
 *     description: Retrieve a list of all orders.
 *     responses:
 *       200:
 *         description: A list of orders
 *       500:
 *         description: Internal Server Error
 *   post:
 *    security:
 *    - Github: []
 *     tags:
 *       - Orders
 *     summary: Create a new order (requires authentication)
 *     description: Add a new order to the database. Required Github authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *               - quantity
 *               - totalPrice
 *               - orderDate
 *               - status
 *               - shippingAddress
 *             properties:
 *               userId:
 *                 type: string
 *               bookId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *               orderDate:
 *                 type: string
 *               status:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: Bad request - validation failed
 *       500:
 *         description: Internal Server Error
 */
router.get('/', ordersController.getAllOrders);
router.post('/', isAuthenticated, orderValidationRules(), validate, ordersController.createOrder);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve a order by ID
 *     description: Retrieve a single order using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single order
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *    security:
 *     - Github: []
 *     tags:
 *       - Orders
 *     summary: Update a order by ID (requires authentication)
 *     description: Update a order's information using its unique ID. Required Github authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the order
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               bookId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *               orderDate:
 *                 type: string
 *               status:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 *       401:
 *         description: Unauthorized - Authentication required
 *   delete:
 *    security:
 *     - Github: []
 *     tags:
 *       - Orders
 *     summary: Delete an order by ID (requires authentication)
 *     description: Delete an order using its unique ID. Required Github authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BaseError('ValidationError', 400, true, 'Invalid user ID format');
    }
    await ordersController.getSingleOrder(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', isAuthenticated, orderValidationRules(), validate, ordersController.updateOrder);
router.delete('/:id', isAuthenticated, ordersController.deleteOrder);

export default router;
