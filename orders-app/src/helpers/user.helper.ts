/**
 * User-related helper functions
 */

import { RootState } from 'shopping_dashboard/store';
import { store } from 'shopping_dashboard/store';

/**
 * Get the current user's ID from the store
 */
export const getCurrentUserId = (): string | null => {
  try {
    const state: RootState = store.getState();
    return state.user?.user?.userId || null;
  } catch (error) {
    console.error('Error accessing store:', error);
    return null;
  }
};

/**
 * Require a user ID, throwing an error if not available
 */
export const requireUserId = (): string => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User ID is required');
  }
  return userId;
};

