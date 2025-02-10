import express from 'express'; // Import express
import reviewsController from '../controllers/reviews.js'; // Import the reviews controller
import { reviewValidationRules, validate } from '../middleware/validation.js'; // Import validation rules and middleware
import BaseError from '../helpers/baseError.js'; // Import BaseError for error handling

const router = express.Router(); // Create a new router instance

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Retrieve all reviews
 *     description: Retrieve a list of all reviews.
 *     responses:
 *       200:
 *         description: A list of reviews
 *       500:
 *         description: Internal Server Error
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a new review
 *     description: Add a new review to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *               - rating
 *               - comment
 *               - reviewDate
 *             properties:
 *               userId:
 *                 type: string
 *               bookId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               reviewDate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request - validation failed
 *       500:
 *         description: Internal Server Error
 */
router.get('/', reviewsController.getAllReviews);
router.post('/', reviewValidationRules(), validate, reviewsController.createReview);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Retrieve a review by ID
 *     description: Retrieve a single review using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single review
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     tags:
 *       - Review
 *     summary: Update a review by ID
 *     description: Update a review's information using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the review
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
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               reviewDate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review by ID
 *     description: Delete a review using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BaseError('ValidationError', 400, true, 'Invalid review ID format');
    }
    await reviewsController.getSingleReview(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', reviewValidationRules(), validate, reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

export default router;
