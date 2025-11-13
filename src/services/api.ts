import { DashboardConfig } from '../types/config';
import { getCurrentUserId } from './userService';
import { CartItem } from '../store/slices/cartSlice';

const API_BASE_URL = 'http://localhost:4001';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const userId = getCurrentUserId();
  if (userId) {
    headers['userId'] = userId;
  }
  return headers;
};

export const fetchDashboardConfig = async (): Promise<DashboardConfig> => {
  const response = await fetch(`${API_BASE_URL}/api/config`, {
    headers: createHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result: ApiResponse<DashboardConfig> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Failed to fetch configuration');
  }
  
  return result.data;
};

const requireUserId = (): string => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User ID is required');
  }
  return userId;
};

export const fetchCart = async (): Promise<CartItem[]> => {
  requireUserId();
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<CartItem[]> = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch cart');
  }

  return result.data || [];
};

export const addToCartAPI = async (productId: number, quantity: number): Promise<CartItem> => {
  requireUserId();
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<CartItem> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Failed to add item to cart');
  }

  return result.data;
};

export const updateCartItemAPI = async (productId: number, quantity: number): Promise<CartItem | null> => {
  requireUserId();
  const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
    method: 'PUT',
    headers: createHeaders(),
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<CartItem> = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to update cart item');
  }

  return result.data || null;
};

export const removeFromCartAPI = async (productId: number): Promise<void> => {
  requireUserId();
  const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
    method: 'DELETE',
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to remove item from cart');
  }
};

export const getProductQuantityAPI = async (productId: number): Promise<number> => {
  const userId = getCurrentUserId();
  if (!userId) {
    return 0;
  }

  const response = await fetch(`${API_BASE_URL}/api/cart/${productId}/quantity`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    return 0;
  }

  const result: ApiResponse<{ productId: number; quantity: number }> = await response.json();
  return result.success && result.data ? result.data.quantity : 0;
};

