import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';

// Import your slices here as you create them
// import cartSlice from './slices/cartSlice';
// import productSlice from './slices/productSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    // Add your reducers here
    // cart: cartSlice,
    // products: productSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

