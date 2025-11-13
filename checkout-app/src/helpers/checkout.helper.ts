/**
 * Checkout-related helper functions
 */

import { CartItem } from 'shopping_dashboard/store';
import { TAX_RATE } from '../constants/checkout.constants';

/**
 * Calculate subtotal from cart items
 */
export const calculateSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total: number, item: CartItem) => total + item.product.price * item.quantity, 0);
};

/**
 * Calculate tax based on subtotal
 */
export const calculateTax = (subtotal: number): number => {
  return subtotal * TAX_RATE;
};

/**
 * Calculate total (subtotal + tax)
 */
export const calculateTotal = (cartItems: CartItem[]): number => {
  const subtotal = calculateSubtotal(cartItems);
  return subtotal + calculateTax(subtotal);
};

