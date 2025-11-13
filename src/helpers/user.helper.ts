/**
 * User-related helper functions
 */

import { store } from '../store/store';
import { User } from '../store/slices/userSlice';

/**
 * Get the Redux store state safely
 */
const getState = () => {
  try {
    return store.getState();
  } catch (error) {
    console.error('Error accessing store:', error);
    return null;
  }
};

/**
 * Get the current user from the store
 */
export const getCurrentUser = (): User | null => {
  const state = getState();
  return state?.user?.user || null;
};

/**
 * Get the current user's ID from the store
 */
export const getCurrentUserId = (): string | null => {
  const state = getState();
  return state?.user?.user?.userId || null;
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

