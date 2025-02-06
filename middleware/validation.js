import { body, validationResult } from 'express-validator'; 

// Validation rules for books
const bookValidationRules = () => [
  body('bookId')
    .trim()
    .notEmpty()
    .withMessage('Book ID is required')
    .isString()
    .withMessage('Book ID must be a string'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),

  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isString()
    .withMessage('Author must be a string'),

  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required')
    .isString()
    .withMessage('Genre must be a string'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('publishedYear')
    .notEmpty()
    .withMessage('Published year is required')
    .isInt({ min: 0 })
    .withMessage('Published year must be a non-negative integer')
]; // Validation rules for books


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    [err.path]: err.msg
  }));

  return res.status(400).json({
    success: false,
    errors: extractedErrors
  });
}; // Middleware to validate request data

export { bookValidationRules, validate, userValidationRules }; // Export validation rules and middleware
