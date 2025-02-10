import express from 'express'; // Import express
import booksController from '../controllers/books.js'; // Import the books controller
import { bookValidationRules, validate } from '../middleware/validation.js'; // Import validation rules and middleware
import BaseError from '../helpers/baseError.js'; // Import BaseError for error handling
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router(); // Create a new router instance

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Books
 *     summary: Retrieve all books
 *     description: Retrieve a list of all books.
 *     responses:
 *       200:
 *         description: A list of books
 *       500:
 *         description: Internal Server Error
 *   post:
 *    security:
 *      - github: []
 *     tags:
 *       - Books
 *     summary: Create a new book (requires authentication)
 *     description: Add a new book to the database. Required Github authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - title
 *               - author
 *               - genre
 *               - price
 *               - stock
 *               - publishedYear
 *             properties:
 *               bookId:
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               publishedYear:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Bad request - validation failed
 *       500:
 *         description: Internal Server Error
 *       401:
 *         description: Unauthorized - Authentication required
 */
router.get('/', booksController.getAllBooks);
router.post('/', isAuthenticated, bookValidationRules(), validate, booksController.createBook);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Retrieve a book by ID
 *     description: Retrieve a single book using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single book
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *    security:
 *     - github: []
 *     tags:
 *       - Books
 *     summary: Update a book by ID (requires authentication)
 *     description: Update a book's information using its unique ID. Required Github authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               publishedYear:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *    security:
 *      - github: []
 *     tags:
 *       - Books
 *     summary: Delete a book by ID (requires authentication)
 *     description: Delete a book using its unique ID. Required Github authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BaseError('ValidationError', 400, true, 'Invalid book ID format');
    }
    await booksController.getSingleBook(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', isAuthenticated, bookValidationRules(), validate, booksController.updateBook);
router.delete('/:id', isAuthenticated, booksController.deleteBook);

export default router;
