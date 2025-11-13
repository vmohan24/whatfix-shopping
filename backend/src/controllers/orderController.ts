import { Request, Response } from 'express';
import { OrderModel, Order, OrderItem, ShippingInfo, PaymentInfo } from '../models/Order';
import { CartModel } from '../models/Cart';

const requireUserId = (req: Request, res: Response): string | null => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'User ID is required'
    });
    return null;
  }
  return req.userId;
};

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const { shippingInfo, paymentInfo } = req.body;

      // Validate shipping info
      if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.address || 
          !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
        res.status(400).json({
          success: false,
          message: 'Shipping information is required'
        });
        return;
      }

      // Validate payment info
      if (!paymentInfo || !paymentInfo.cardNumber || !paymentInfo.cardName || 
          !paymentInfo.expiryDate || !paymentInfo.cvv) {
        res.status(400).json({
          success: false,
          message: 'Payment information is required'
        });
        return;
      }

      // Get cart items
      const cartItems = CartModel.getCart(userId);
      if (cartItems.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot create order with empty cart'
        });
        return;
      }

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      // Convert cart items to order items
      const orderItems: OrderItem[] = cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity
      }));

      // Create order
      const order = OrderModel.createOrder(
        userId,
        orderItems,
        shippingInfo as ShippingInfo,
        paymentInfo as PaymentInfo,
        subtotal,
        tax,
        total
      );

      // Clear the cart after order is created
      CartModel.clearCart(userId);

      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const orders = OrderModel.getOrders(userId);
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const { orderId } = req.params;
      if (!orderId) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
        return;
      }

      const order = OrderModel.getOrderById(userId, orderId);
      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

