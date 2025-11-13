import { Request, Response } from 'express';
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

export class CartController {
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const cartItems = CartModel.getCart(userId);
      res.status(200).json({
        success: true,
        data: cartItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const { productId, quantity } = req.body;

      if (typeof productId !== 'number' || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'Product ID and quantity are required. Quantity must be a positive number.'
        });
        return;
      }

      const cartItem = CartModel.addToCart(userId, productId, quantity);
      res.status(200).json({
        success: true,
        data: cartItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add item to cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const productIdNum = parseInt(req.params.productId, 10);
      const { quantity } = req.body;

      if (isNaN(productIdNum) || typeof quantity !== 'number' || quantity < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID or quantity'
        });
        return;
      }

      const cartItem = CartModel.updateCartItem(userId, productIdNum, quantity);
      res.status(200).json({
        success: true,
        data: cartItem,
        message: quantity === 0 ? 'Item removed from cart' : 'Cart item updated'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: 'Failed to update cart item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const productIdNum = parseInt(req.params.productId, 10);
      if (isNaN(productIdNum)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
        return;
      }

      CartModel.removeFromCart(userId, productIdNum);
      res.status(200).json({
        success: true,
        message: 'Item removed from cart'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to remove item from cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      CartModel.clearCart(userId);
      res.status(200).json({
        success: true,
        message: 'Cart cleared'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to clear cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getProductQuantity(req: Request, res: Response): Promise<void> {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const productIdNum = parseInt(req.params.productId, 10);
      if (isNaN(productIdNum)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
        return;
      }

      const quantity = CartModel.getProductQuantity(userId, productIdNum);
      res.status(200).json({
        success: true,
        data: { productId: productIdNum, quantity }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get product quantity',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

