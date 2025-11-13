declare module 'product_category_app/Clothing' {
  import { ComponentType } from 'react';
  const Clothing: ComponentType;
  export default Clothing;
}

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

declare module 'shopping_dashboard/store' {
  export * from '../store/store';
}

