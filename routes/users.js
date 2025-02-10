import express from 'express'; // Import express
import usersController from '../controllers/users.js'; // Import the users controller
import { userValidationRules, validate } from '../middleware/validation.js'; // Import validation rules and middleware
import BaseError from '../helpers/baseError.js'; // Import BaseError for error handling
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router(); // Create a new router instance

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal Server Error
 *   post:
 *    security:
 *      - github: []
 *     tags:
 *       - Users
 *     summary: Create a new user (requires authentication)
 *     description: Add a new user to the database. Required Github authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *               - createdAt
 *               - address
 *             properties:
 *               userId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               createdAt:
 *                 type: string
 *               address:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request - validation failed
 *       401:
 *        description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
router.get('/', usersController.getAllUsers);
router.post('/', isAuthenticated, userValidationRules(), validate, usersController.createUser);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a user by ID
 *     description: Retrieve a single user using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single user
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     security:
 *       - github: []
 *     tags:
 *       - Users
 *     summary: Update a user by ID (requires authentication)
 *     description: Update a user's information using its unique ID. Required Github authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               createdAt:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid ID format
 *        401:
 *        description: Unauthorized - Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *    security:
 *       - github: []
 *     tags:
 *       - Users
 *     summary: Delete a user by ID (requires authentication)
 *     description: Delete a user using its unique ID. Required Github authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BaseError('ValidationError', 400, true, 'Invalid user ID format');
    }
    await usersController.getSingleUser(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', isAuthenticated, userValidationRules(), validate, usersController.updateUser);
router.delete('/:id', isAuthenticated, usersController.deleteUser);

export default router;
