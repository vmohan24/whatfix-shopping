import { API_BASE_URL } from './constants/api.constants';
import { requireUserId } from './helpers/user.helper';
import { createHeaders } from './helpers/api.helper';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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

