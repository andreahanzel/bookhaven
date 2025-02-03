import express from 'express'; // Import express
import categoriesController from '../controllers/categories.js'; // Import the categories controller
import { categoryValidationRules, validate } from '../middleware/validation.js'; // Import validation rules and middleware
import BaseError from '../helpers/baseError.js'; // Import BaseError for error handling
import { isAuthenticated } from '../middleware/authenticate.js';

const router = express.Router(); // Create a new router instance

router.get('/', categoriesController.getAll);
router.post('/', isAuthenticated, categoryValidationRules(), validate, categoriesController.createCategory);

router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BaseError('ValidationError', 400, true, 'Invalid category ID format');
    }
    await categoriesController.getSingle(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', isAuthenticated, categoryValidationRules(), validate, categoriesController.updateCategory);
router.delete('/:id', isAuthenticated, categoriesController.deleteCategory);

export default router;
