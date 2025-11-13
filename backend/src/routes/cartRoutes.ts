import { Router } from 'express';
import { CartController } from '../controllers/cartController';

const router = Router();

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private (requires userId header)
 */
router.get('/', CartController.getCart);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private (requires userId header)
 */
router.post('/', CartController.addToCart);

/**
 * @route   PUT /api/cart/:productId
 * @desc    Update cart item quantity
 * @access  Private (requires userId header)
 */
router.put('/:productId', CartController.updateCartItem);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove item from cart
 * @access  Private (requires userId header)
 */
router.delete('/:productId', CartController.removeFromCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private (requires userId header)
 */
router.delete('/', CartController.clearCart);

/**
 * @route   GET /api/cart/:productId/quantity
 * @desc    Get quantity of a specific product in cart
 * @access  Private (requires userId header)
 */
router.get('/:productId/quantity', CartController.getProductQuantity);

export default router;

