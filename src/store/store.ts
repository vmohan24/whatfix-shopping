import { configureStore } from '@reduxjs/toolkit';

// Import your slices here as you create them
// import cartSlice from './slices/cartSlice';
// import userSlice from './slices/userSlice';
// import productSlice from './slices/productSlice';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    // cart: cartSlice,
    // user: userSlice,
    // products: productSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

