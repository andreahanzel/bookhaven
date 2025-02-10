// Middleware to check if the user is authenticated
export const isAuthenticated = (req, res, next) => {
  console.log('Authentication check:', {
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session
  });

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Do not have access. Authentication is required' });
  }
  next();
}; // Export the middleware function
