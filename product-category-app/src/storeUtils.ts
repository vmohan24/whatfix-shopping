/**
 * Utility functions to safely access the Redux store from the host app
 * These functions handle the case when the store is not available (standalone mode)
 */

import { configureStore } from '@reduxjs/toolkit';

let storeModule: any = null;
let isStoreAvailable = false;

/**
 * Try to load the store module from the remote
 * This will fail gracefully if the remote is not available
 */
export const tryLoadStore = (): boolean => {
  if (storeModule !== null) {
    return isStoreAvailable;
  }

  try {
    storeModule = require('shopping_dashboard/store');
    isStoreAvailable = !!storeModule?.store;
    return isStoreAvailable;
  } catch (error) {
    console.warn('Redux store not available (running in standalone mode):', error);
    isStoreAvailable = false;
    return false;
  }
};

/**
 * Get the store if available, otherwise create a dummy store
 * This ensures Redux hooks always work
 */
export const getStore = () => {
  if (tryLoadStore()) {
    return storeModule.store;
  }
  
  // Create a dummy store for standalone mode
  // This allows Redux hooks to work even without the real store
  return configureStore({
    reducer: {
      cart: (state = { items: [] }) => state,
      user: (state = { user: null }) => state,
    },
  });
};

/**
 * Get the RootState type if available
 */
export type RootState = any; // Will be properly typed if store is available

/**
 * Get the AppDispatch type if available
 */
export type AppDispatch = any; // Will be properly typed if store is available

/**
 * Check if the store is available
 */
export const isStoreReady = (): boolean => {
  return tryLoadStore();
};

/**
 * Get cart actions if store is available
 */
export const getCartActions = () => {
  if (tryLoadStore()) {
    return {
      fetchCartAsync: storeModule.fetchCartAsync,
      addToCartAsync: storeModule.addToCartAsync,
      updateCartItemAsync: storeModule.updateCartItemAsync,
      removeFromCartAsync: storeModule.removeFromCartAsync,
    };
  }
  return null;
};

