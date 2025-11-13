/**
 * User service to get user data from the Redux store
 */

import { store } from '../store/store';
import { User } from '../store/slices/userSlice';

/**
 * Get the current user from the store
 */
export const getCurrentUser = (): User | null => {
  try {
    const state = store.getState();
    return state.user?.user || null;
  } catch (error) {
    console.error('Error accessing store:', error);
    return null;
  }
};

/**
 * Get the current user's ID from the store
 */
export const getCurrentUserId = (): string | null => {
  try {
    const state = store.getState();
    return state.user?.user?.userId || null;
  } catch (error) {
    console.error('Error accessing store:', error);
    return null;
  }
};

