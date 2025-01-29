import express from 'express'; // Router for Swagger documentation
import swaggerUi from 'swagger-ui-express'; // Middleware for serving Swagger UI
import fs from 'fs'; // File system module
import path from 'path'; // Path module

const router = express.Router();

// Dynamically load the Swagger JSON
let swaggerDocument;
try {
  swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('swagger_output.json'), 'utf-8'));
} catch (err) {
  console.error('Failed to load Swagger document:', err.message);
  swaggerDocument = {}; // Fallback to an empty object
}

// Mount the Swagger UI at /api-docs
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router; // Export the router
