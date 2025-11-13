declare module 'product_category_app/ProductCategory' {
  import { ComponentType } from 'react';
  const ProductCategory: ComponentType<{ category?: string }>;
  export default ProductCategory;
}

declare module 'product_category_app/ProductDetail' {
  import { ComponentType } from 'react';
  const ProductDetail: ComponentType;
  export default ProductDetail;
}

declare module 'cart_app/Cart' {
  import { ComponentType } from 'react';
  const Cart: ComponentType;
  export default Cart;
}

declare module 'checkout_app/Checkout' {
  import { ComponentType } from 'react';
  const Checkout: ComponentType;
  export default Checkout;
}

declare module 'shopping_dashboard/store' {
  export * from '../store/store';
}

