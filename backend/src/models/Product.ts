export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subCategory: string;
}

/**
 * Product data model
 */
export class ProductModel {
  // Cached lookup map: productId -> { product, mainCategory }
  private static productLookupCache: Map<number, { product: Product; mainCategory: string }> | null = null;

  private static allProducts: Record<string, Product[]> = {
    clothing: [
      { id: 1, name: 'Classic White T-Shirt', price: 29.99, image: '👕', category: 'Tops', subCategory: 'T-Shirts' },
      { id: 2, name: 'Denim Jacket', price: 79.99, image: '🧥', category: 'Outerwear', subCategory: 'Jackets' },
      { id: 3, name: 'Slim Fit Jeans', price: 59.99, image: '👖', category: 'Bottoms', subCategory: 'Jeans' },
      { id: 4, name: 'Cotton Hoodie', price: 49.99, image: '👔', category: 'Tops', subCategory: 'Hoodies' },
      { id: 5, name: 'Chino Pants', price: 54.99, image: '👖', category: 'Bottoms', subCategory: 'Pants' },
      { id: 6, name: 'Polo Shirt', price: 39.99, image: '👕', category: 'Tops', subCategory: 'Polo Shirts' },
      { id: 7, name: 'Wool Sweater', price: 69.99, image: '🧶', category: 'Tops', subCategory: 'Sweaters' },
      { id: 8, name: 'Cargo Shorts', price: 44.99, image: '🩳', category: 'Bottoms', subCategory: 'Shorts' },
      { id: 9, name: 'Leather Jacket', price: 149.99, image: '🧥', category: 'Outerwear', subCategory: 'Jackets' },
      { id: 10, name: 'Button-Down Shirt', price: 49.99, image: '👔', category: 'Tops', subCategory: 'Dress Shirts' },
    ],
    electronics: [
      { id: 101, name: 'Wireless Headphones', price: 129.99, image: '🎧', category: 'Audio', subCategory: 'Headphones' },
      { id: 102, name: 'Smart TV 55"', price: 599.99, image: '📺', category: 'TV', subCategory: 'Smart-TVs' },
      { id: 103, name: 'Laptop Stand', price: 39.99, image: '💻', category: 'Accessories', subCategory: 'Stands' },
      { id: 104, name: 'Mechanical Keyboard', price: 89.99, image: '⌨️', category: 'Accessories', subCategory: 'Keyboards' },
      { id: 105, name: 'Gaming Mouse', price: 59.99, image: '🖱️', category: 'Accessories', subCategory: 'Mice' },
      { id: 106, name: 'USB-C Hub', price: 34.99, image: '🔌', category: 'Accessories', subCategory: 'Adapters' },
      { id: 107, name: 'Bluetooth Speaker', price: 79.99, image: '🔊', category: 'Audio', subCategory: 'Speakers' },
      { id: 108, name: 'Monitor 27"', price: 249.99, image: '🖥️', category: 'Display', subCategory: 'Monitors' },
      { id: 109, name: 'Webcam HD', price: 49.99, image: '📹', category: 'Accessories', subCategory: 'Cameras' },
      { id: 110, name: 'Tablet Stand', price: 24.99, image: '📱', category: 'Accessories', subCategory: 'Stands' },
    ],
    mobiles: [
      { id: 201, name: 'Smartphone Pro Max', price: 999.99, image: '📱', category: 'Flagship', subCategory: 'Premium' },
      { id: 202, name: 'Budget Phone', price: 199.99, image: '📱', category: 'Budget', subCategory: 'Entry Level' },
      { id: 203, name: 'Gaming Phone', price: 799.99, image: '🎮', category: 'Gaming', subCategory: 'Performance' },
      { id: 204, name: 'Phone Case', price: 19.99, image: '📱', category: 'Accessories', subCategory: 'Protection' },
      { id: 205, name: 'Screen Protector', price: 14.99, image: '🛡️', category: 'Accessories', subCategory: 'Protection' },
      { id: 206, name: 'Wireless Charger', price: 29.99, image: '🔋', category: 'Accessories', subCategory: 'Charging' },
      { id: 207, name: 'Phone Stand', price: 12.99, image: '📱', category: 'Accessories', subCategory: 'Stands' },
      { id: 208, name: 'Bluetooth Earbuds', price: 79.99, image: '🎧', category: 'Audio', subCategory: 'Earbuds' },
      { id: 209, name: 'Power Bank', price: 39.99, image: '🔌', category: 'Accessories', subCategory: 'Charging' },
      { id: 210, name: 'Phone Grip', price: 9.99, image: '📱', category: 'Accessories', subCategory: 'Grips' },
    ],
  };

  /**
   * Get all products for a category
   */
  static getProductsByCategory(category: string): Product[] {
    return this.allProducts[category] || [];
  }

  /**
   * Get products by category and subcategory (case-insensitive matching)
   */
  static getProductsByCategoryAndSubCategory(category: string, subCategory: string): Product[] {
    const products = this.getProductsByCategory(category);
    if (!subCategory) {
      return products;
    }
    // Case-insensitive matching for subcategory
    const subCategoryLower = subCategory.toLowerCase();
    return products.filter(p => p.subCategory.toLowerCase() === subCategoryLower);
  }

  /**
   * Get all products as a flat array
   */
  static getAllProducts(): Product[] {
    return Object.values(this.allProducts).flat();
  }

  /**
   * Get a single product by category and id
   */
  static getProductById(category: string, productId: number): Product | undefined {
    const products = this.getProductsByCategory(category);
    return products.find(p => p.id === productId);
  }

  /**
   * Build the product lookup cache by flattening all products across categories
   * This is built lazily on first access
   */
  private static buildProductLookupCache(): void {
    if (this.productLookupCache !== null) {
      return; // Cache already built
    }

    this.productLookupCache = new Map();
    
    // Flatten all products across categories and build lookup map
    for (const [mainCategory, products] of Object.entries(this.allProducts)) {
      for (const product of products) {
        this.productLookupCache.set(product.id, { product, mainCategory });
      }
    }
  }

  /**
   * Find a product by ID across all categories using a flat lookup map
   * Returns the product and its main category
   */
  static findProductById(productId: number): { product: Product; mainCategory: string } | null {
    this.buildProductLookupCache();
    return this.productLookupCache!.get(productId) || null;
  }
}

