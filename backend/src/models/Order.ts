// Model for managing user orders

import { Product } from './Product';

export interface OrderItem {
  product: Product;
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
  createdAt: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

/**
 * Order model - stores user orders in memory
 * Key: userId, Value: Array of Order
 */
export class OrderModel {
  // In-memory store: userId -> Order[]
  private static orders: Map<string, Order[]> = new Map();
  private static orderIdCounter: number = 1;

  /**
   * Create a new order
   */
  static createOrder(
    userId: string,
    items: OrderItem[],
    shippingInfo: ShippingInfo,
    paymentInfo: PaymentInfo,
    subtotal: number,
    tax: number,
    total: number
  ): Order {
    if (!userId) {
      throw new Error('UserId is required');
    }

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const order: Order = {
      id: `ORD-${Date.now()}-${this.orderIdCounter++}`,
      userId,
      items: [...items], // Create a copy
      shippingInfo: { ...shippingInfo }, // Create a copy
      paymentInfo: { ...paymentInfo }, // Create a copy (masked for security)
      subtotal,
      tax,
      total,
      createdAt: new Date(),
      status: 'pending',
    };

    // Initialize orders array for user if it doesn't exist
    if (!this.orders.has(userId)) {
      this.orders.set(userId, []);
    }

    const userOrders = this.orders.get(userId)!;
    userOrders.push(order);

    // Sort orders by creation date (newest first)
    userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return order;
  }

  /**
   * Get all orders for a user
   */
  static getOrders(userId: string): Order[] {
    if (!userId || !this.orders.has(userId)) {
      return [];
    }

    return [...this.orders.get(userId)!]; // Return a copy
  }

  /**
   * Get a specific order by ID for a user
   */
  static getOrderById(userId: string, orderId: string): Order | null {
    if (!userId || !this.orders.has(userId)) {
      return null;
    }

    const userOrders = this.orders.get(userId)!;
    return userOrders.find(order => order.id === orderId) || null;
  }

  /**
   * Update order status
   */
  static updateOrderStatus(userId: string, orderId: string, status: Order['status']): Order | null {
    if (!userId || !this.orders.has(userId)) {
      return null;
    }

    const userOrders = this.orders.get(userId)!;
    const order = userOrders.find(o => o.id === orderId);

    if (!order) {
      return null;
    }

    order.status = status;
    return order;
  }
}

