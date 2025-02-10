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

// Validation rules for users
const userValidationRules = () => [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name must be a string'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isString()
    .withMessage('Role must be a string'),

  body('createdAt')
    .notEmpty()
    .withMessage('Creation date is required')
    .isString()
    .withMessage('Creation must be a string'),

  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isString()
    .withMessage('Address must be a string')
]; // Validation rules for users

// Validation rules for orders
const orderValidationRules = () => [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),

  body('bookId')
    .trim()
    .notEmpty()
    .withMessage('Book ID is required')
    .isString()
    .withMessage('Book ID must be a string'),

    body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),

    body('totalPrice')
    .notEmpty()
    .withMessage('Total Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Total Price must be a positive number'),

  body('orderDate')
    .notEmpty()
    .withMessage('Order date is required')
    .isString()
    .withMessage('Order date must be a string'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isString()
    .withMessage('Status must be a string'),

  body('shippingAddress')
    .notEmpty()
    .withMessage('Shipping address is required')
    .isString()
    .withMessage('Shipping address be a string'),
]; // Validation rules for orders

// Validation rules for reviews
const reviewValidationRules = () => [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),

  body('bookId')
    .trim()
    .notEmpty()
    .withMessage('Book ID is required')
    .isString()
    .withMessage('Book ID must be a string'),

    body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 0 })
    .withMessage('Rating must be a non-negative integer'),

  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isString()
    .withMessage('Comment must be a string'),

  body('reviewDate')
    .notEmpty()
    .withMessage('Review date is required')
    .isString()
    .withMessage('Review date must be a string'),
]; // Validation rules for reviews

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

export { bookValidationRules, userValidationRules, orderValidationRules, reviewValidationRules, validate }; // Export validation rules and middleware
