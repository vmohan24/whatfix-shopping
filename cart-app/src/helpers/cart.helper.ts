/**
 * Cart-related helper functions
 */

import { CartItem } from 'shopping_dashboard/store';

/**
 * Calculate total price from cart items
 */
export const calculateTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total: number, item: CartItem) => total + item.product.price * item.quantity, 0);
};

