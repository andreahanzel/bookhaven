import BaseError from '../helpers/baseError.js'; // Error handler middleware

// Error handler middleware
export const errorHandler = (err, req, res, _next) => {
  // If the error is operational, send it to the client
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    }); 
  }

  // If it's a MongoDB error
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Duplicate key error'
    });
  }

  // For any other error, send 500
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Something went wrong'
  });
};
