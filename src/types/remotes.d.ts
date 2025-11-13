declare module 'clothing_app/Clothing' {
  import { ComponentType } from 'react';
  const Clothing: ComponentType;
  export default Clothing;
}

declare module 'clothing_app/ProductCategory' {
  import { ComponentType } from 'react';
  const ProductCategory: ComponentType<{ category?: string }>;
  export default ProductCategory;
}

declare module 'clothing_app/ProductDetail' {
  import { ComponentType } from 'react';
  const ProductDetail: ComponentType;
  export default ProductDetail;
}

