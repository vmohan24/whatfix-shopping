/**
 * User service to manage dummy user data
 */

export interface User {
  userId: string;
  name: string;
  email: string;
}

// Create a dummy user with a fixed userId
const DUMMY_USER: User = {
  userId: 'user-12345',
  name: 'John Doe',
  email: 'john.doe@example.com'
};

/**
 * Get the current user (dummy user)
 */
export const getCurrentUser = (): User => {
  return DUMMY_USER;
};

/**
 * Get the current user's ID
 */
export const getCurrentUserId = (): string => {
  return DUMMY_USER.userId;
};

