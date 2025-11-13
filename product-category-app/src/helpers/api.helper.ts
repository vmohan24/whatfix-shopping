/**
 * API-related helper functions
 */

import { getCurrentUserId } from './user.helper';

/**
 * Create headers for API requests with user ID if available
 */
export const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const userId = getCurrentUserId();
  if (userId) {
    headers['userId'] = userId;
  }
  return headers;
};

