import express from 'express'; // Main router for the application
import ordersRouter from './orders.js'; // Router for order-related routes
import usersRouter from './users.js'; // Router for user-related routes
import booksRouter from './books.js'; // Router for order-related routes
import reviewsRouter from './reviews.js'; // Router for user-related routes
import swaggerRouter from './swagger.js'; // Router for Swagger documentation
import passport from 'passport';

const router = express.Router();

// Mount the Swagger router
router.use('/', swaggerRouter);
// Mount the orders router at /orders
router.use('/orders', ordersRouter);
// Mount the reviews router at /reviews
router.use('/reviews', reviewsRouter);
// Mount the books router at /books
router.use('/books', booksRouter);
// Mount the users router at /users
router.use('/users', usersRouter);

// Add GitHub authentication routes
router.get('/login', passport.authenticate('github'), (_req, _res) => {});

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}); // Logout route

// Add a root route for testing
router.get('/', (req, res) => {
  //#swagger.tags = ['Hello World']
  res.send('Hello, This is the BookHaven API!');
});

// Export the main router
export default router;
