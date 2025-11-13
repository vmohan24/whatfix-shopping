/**
 * Order-related helper functions
 */

import { Order } from '../api';
import { ORDER_STATUS_COLORS, DATE_FORMAT_OPTIONS } from '../constants/order.constants';

/**
 * Format date string to localized date format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
};

/**
 * Get status color for order status
 */
export const getStatusColor = (status: Order['status']): string => {
  return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.default;
};

