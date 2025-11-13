import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

/**
 * Controller for handling product requests
 */
export class ProductController {
  /**
   * Get all products for a category
   * GET /api/products/:category
   */
  static async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      // userId is available via req.userId (extracted by userMiddleware)
      
      if (!category) {
        res.status(400).json({
          success: false,
          message: 'Category parameter is required'
        });
        return;
      }

      const products = ProductModel.getProductsByCategory(category);
      
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get a single product by category and id
   * GET /api/products/:category/:productId
   */
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { category, productId } = req.params;
      // userId is available via req.userId (extracted by userMiddleware)
      
      if (!category || !productId) {
        res.status(400).json({
          success: false,
          message: 'Category and productId parameters are required'
        });
        return;
      }

      const productIdNum = parseInt(productId, 10);
      if (isNaN(productIdNum)) {
        res.status(400).json({
          success: false,
          message: 'Invalid productId'
        });
        return;
      }

      const product = ProductModel.getProductById(category, productIdNum);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get all products grouped by category
   * GET /api/products
   */
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      // userId is available via req.userId (extracted by userMiddleware)
      const products = ProductModel.getAllProducts();
      
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

