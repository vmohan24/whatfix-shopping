/**
 * Route-related constants
 */

import React from 'react';

// Lazy loaded components
const Profile = React.lazy(() => import('../modules/Profile'));
const Cart = React.lazy(() => import('cart_app/Cart'));
const Orders = React.lazy(() => import('orders_app/Orders'));
const Checkout = React.lazy(() => import('checkout_app/Checkout'));
const Payment = React.lazy(() => import('../modules/Payment'));

/**
 * Component mapping for different route types
 */
export const componentMap: Record<string, React.LazyExoticComponent<any>> = {
  profile: Profile,
  cart: Cart,
  orders: Orders,
  checkout: Checkout,
  payment: Payment,
};

