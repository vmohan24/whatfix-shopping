declare module 'shopping_dashboard/store' {
  import { Store } from '@reduxjs/toolkit';
  
  export const store: Store;
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  
  // Cart actions (legacy sync actions)
  export function addToCart(payload: { product: Product; quantity: number }): any;
  export function updateQuantity(payload: { productId: number; quantity: number }): any;
  export function removeFromCart(productId: number): any;
  export function clearCart(): any;
  export function loadCart(items: CartItem[]): any;
  
  // Cart async thunks - these are functions that return thunk actions
  export function fetchCartAsync(): any;
  export function addToCartAsync(payload: { productId: number; quantity: number }): any;
  export function updateCartItemAsync(payload: { productId: number; quantity: number }): any;
  export function removeFromCartAsync(productId: number): any;
  
  // Cart types
  export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
}

