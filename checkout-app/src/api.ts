import { API_BASE_URL } from './constants/api.constants';
import { requireUserId } from './helpers/user.helper';
import { createHeaders } from './helpers/api.helper';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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

