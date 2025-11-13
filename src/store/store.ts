import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';

// Import your slices here as you create them
// import productSlice from './slices/productSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    // Add your reducers here
    // products: productSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export cart actions for use in remote apps
export { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  loadCart,
  fetchCartAsync,
  addToCartAsync,
  updateCartItemAsync,
  removeFromCartAsync
} from './slices/cartSlice';
export type { Product, CartItem } from './slices/cartSlice';
export type { User } from './slices/userSlice';

