import { Router } from 'express';
import { OrderController } from '../controllers/orderController';

const router = Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order from cart
 * @access  Private (requires userId header)
 */
router.post('/', OrderController.createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders for the user
 * @access  Private (requires userId header)
 */
router.get('/', OrderController.getOrders);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get a specific order by ID
 * @access  Private (requires userId header)
 */
router.get('/:orderId', OrderController.getOrderById);

export default router;

