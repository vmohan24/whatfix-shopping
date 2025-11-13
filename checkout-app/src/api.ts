import { RootState } from 'shopping_dashboard/store';
import { store } from 'shopping_dashboard/store';

const API_BASE_URL = 'http://localhost:4001';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const getCurrentUserId = (): string | null => {
  try {
    const state: RootState = store.getState();
    return state.user?.user?.userId || null;
  } catch (error) {
    console.error('Error accessing store:', error);
    return null;
  }
};

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
  items: Array<{
    product: {
      id: number;
      name: string;
      price: number;
      image: string;
      category: string;
    };
    quantity: number;
  }>;
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
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User ID is required');
  }

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

