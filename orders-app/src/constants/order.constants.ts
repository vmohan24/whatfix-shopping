/**
 * Order-related constants
 */

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: '#ffa500',
  processing: '#0066cc',
  shipped: '#0066cc',
  delivered: '#00aa00',
  cancelled: '#cc0000',
  default: '#808080',
};

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

