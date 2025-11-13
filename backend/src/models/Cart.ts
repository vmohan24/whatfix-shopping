// Model for managing user shopping cart

import { ProductModel, Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Cart model - stores user cart items in memory
 * Key: userId, Value: Map of productId -> CartItem
 */
export class CartModel {
  // In-memory store: userId -> Map<productId, CartItem>
  private static carts: Map<string, Map<number, CartItem>> = new Map();

  /**
   * Get all cart items for a user
   */
  static getCart(userId: string): CartItem[] {
    if (!userId || !this.carts.has(userId)) {
      return [];
    }

    const userCart = this.carts.get(userId)!;
    return Array.from(userCart.values());
  }

  /**
   * Add or update an item in the cart
   * If the product already exists, it adds to the existing quantity
   */
  static addToCart(userId: string, productId: number, quantity: number): CartItem {
    if (!userId) {
      throw new Error('UserId is required');
    }

    // Find the product
    const result = ProductModel.findProductById(productId);
    if (!result) {
      throw new Error(`Product with id ${productId} not found`);
    }

    const { product } = result;

    // Initialize cart for user if it doesn't exist
    if (!this.carts.has(userId)) {
      this.carts.set(userId, new Map());
    }

    const userCart = this.carts.get(userId)!;
    
    // Check if product already exists in cart
    if (userCart.has(productId)) {
      const existingItem = userCart.get(productId)!;
      existingItem.quantity += quantity;
      return existingItem;
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        product,
        quantity
      };
      userCart.set(productId, newItem);
      return newItem;
    }
  }

  /**
   * Update the quantity of an item in the cart
   * If quantity is 0 or less, the item is removed
   */
  static updateCartItem(userId: string, productId: number, quantity: number): CartItem | null {
    if (!userId) {
      throw new Error('UserId is required');
    }

    if (!this.carts.has(userId)) {
      throw new Error('Cart not found for user');
    }

    const userCart = this.carts.get(userId)!;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      userCart.delete(productId);
      return null;
    }

    if (!userCart.has(productId)) {
      throw new Error(`Product with id ${productId} not found in cart`);
    }

    const item = userCart.get(productId)!;
    item.quantity = quantity;
    return item;
  }

  /**
   * Remove an item from the cart
   */
  static removeFromCart(userId: string, productId: number): void {
    if (!userId) {
      throw new Error('UserId is required');
    }

    if (!this.carts.has(userId)) {
      return; // Cart doesn't exist, nothing to remove
    }

    const userCart = this.carts.get(userId)!;
    userCart.delete(productId);
  }

  /**
   * Clear the entire cart for a user
   */
  static clearCart(userId: string): void {
    if (!userId) {
      return;
    }
    this.carts.delete(userId);
  }

  /**
   * Get the quantity of a specific product in the cart
   */
  static getProductQuantity(userId: string, productId: number): number {
    if (!userId || !this.carts.has(userId)) {
      return 0;
    }

    const userCart = this.carts.get(userId)!;
    const item = userCart.get(productId);
    return item ? item.quantity : 0;
  }
}

