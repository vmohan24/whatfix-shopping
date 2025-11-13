import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get all products grouped by category
 * @access  Public
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route   GET /api/products/:category/:subCategory
 * @desc    Get products by category and subcategory
 * @access  Public
 * @note    This route must come before /:category/:productId to avoid route conflicts
 *          The controller will check if subCategory is numeric and handle accordingly
 */
router.get('/:category/:subCategory', ProductController.getProductsByCategoryAndSubCategory);

/**
 * @route   GET /api/products/:category/:productId
 * @desc    Get a single product by category and id
 * @access  Public
 * @note    This route must come before /:category to avoid route conflicts
 */
router.get('/:category/:productId', ProductController.getProductById);

/**
 * @route   GET /api/products/:category
 * @desc    Get all products for a specific category
 * @access  Public
 */
router.get('/:category', ProductController.getProductsByCategory);

export default router;

