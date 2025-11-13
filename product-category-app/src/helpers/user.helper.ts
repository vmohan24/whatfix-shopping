/**
 * User-related helper functions
 */

/**
 * Get the current user's ID from the host app's store
 * This accesses the shared Redux store from the main shopping_dashboard app
 */
export const getCurrentUserId = (): string | null => {
  try {
    // Try to access the shared Redux store from the host app
    const { store } = require('shopping_dashboard/store');
    const state = store.getState();
    
    // Check if user slice exists and has userId
    if (state.user?.user?.userId) {
      return state.user.user.userId;
    }
    
    // If no user slice or userId, return null
    return null;
  } catch (error) {
    // If store is not available (e.g., running standalone), return null
    console.warn('Could not access shared store:', error);
    return null;
  }
};

