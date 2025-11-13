/**
 * Get the current user's ID from the host app's store if available, otherwise null
 */
export const getCurrentUserId = (): string | null => {
  try {
    // Try to access the shared Redux store from the host app
    const { store } = require('shopping_dashboard/store');
    const state = store.getState();
    
    // Check if user slice exists and has userId
    if (state.user?.userId) {
      return state.user.userId;
    }
    
    // If no user slice or userId, return null
    return null;
  } catch (error) {
    // If store is not available (e.g., running standalone), return null
    return null;
  }
};

