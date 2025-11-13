import { DashboardConfig } from '../types/config';
import { CartItem } from '../store/slices/cartSlice';
import { API_BASE_URL } from '../constants/api.constants';
import { getCurrentUserId, requireUserId } from '../helpers/user.helper';
import { createHeaders } from '../helpers/api.helper';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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

// Order types
export interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export const createOrderAPI = async (
  shippingInfo: ShippingInfo,
  paymentInfo: PaymentInfo
): Promise<Order> => {
  requireUserId();
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify({ shippingInfo, paymentInfo }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<Order> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Failed to create order');
  }

  return result.data;
};

export const fetchOrdersAPI = async (): Promise<Order[]> => {
  requireUserId();
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<Order[]> = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch orders');
  }

  return result.data || [];
};

export const fetchOrderByIdAPI = async (orderId: string): Promise<Order> => {
  requireUserId();
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<Order> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Failed to fetch order');
  }

  return result.data;
};

