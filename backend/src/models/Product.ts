export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

/**
 * Product data model
 */
export class ProductModel {
  private static allProducts: Record<string, Product[]> = {
    clothing: [
      { id: 1, name: 'Classic White T-Shirt', price: 29.99, image: '👕', category: 'Tops' },
      { id: 2, name: 'Denim Jacket', price: 79.99, image: '🧥', category: 'Outerwear' },
      { id: 3, name: 'Slim Fit Jeans', price: 59.99, image: '👖', category: 'Bottoms' },
      { id: 4, name: 'Cotton Hoodie', price: 49.99, image: '👔', category: 'Tops' },
      { id: 5, name: 'Chino Pants', price: 54.99, image: '👖', category: 'Bottoms' },
      { id: 6, name: 'Polo Shirt', price: 39.99, image: '👕', category: 'Tops' },
      { id: 7, name: 'Wool Sweater', price: 69.99, image: '🧶', category: 'Tops' },
      { id: 8, name: 'Cargo Shorts', price: 44.99, image: '🩳', category: 'Bottoms' },
      { id: 9, name: 'Leather Jacket', price: 149.99, image: '🧥', category: 'Outerwear' },
      { id: 10, name: 'Button-Down Shirt', price: 49.99, image: '👔', category: 'Tops' },
    ],
    electronics: [
      { id: 101, name: 'Wireless Headphones', price: 129.99, image: '🎧', category: 'Audio' },
      { id: 102, name: 'Smart TV 55"', price: 599.99, image: '📺', category: 'TV' },
      { id: 103, name: 'Laptop Stand', price: 39.99, image: '💻', category: 'Accessories' },
      { id: 104, name: 'Mechanical Keyboard', price: 89.99, image: '⌨️', category: 'Accessories' },
      { id: 105, name: 'Gaming Mouse', price: 59.99, image: '🖱️', category: 'Accessories' },
      { id: 106, name: 'USB-C Hub', price: 34.99, image: '🔌', category: 'Accessories' },
      { id: 107, name: 'Bluetooth Speaker', price: 79.99, image: '🔊', category: 'Audio' },
      { id: 108, name: 'Monitor 27"', price: 249.99, image: '🖥️', category: 'Display' },
      { id: 109, name: 'Webcam HD', price: 49.99, image: '📹', category: 'Accessories' },
      { id: 110, name: 'Tablet Stand', price: 24.99, image: '📱', category: 'Accessories' },
    ],
    mobiles: [
      { id: 201, name: 'Smartphone Pro Max', price: 999.99, image: '📱', category: 'Flagship' },
      { id: 202, name: 'Budget Phone', price: 199.99, image: '📱', category: 'Budget' },
      { id: 203, name: 'Gaming Phone', price: 799.99, image: '🎮', category: 'Gaming' },
      { id: 204, name: 'Phone Case', price: 19.99, image: '📱', category: 'Accessories' },
      { id: 205, name: 'Screen Protector', price: 14.99, image: '🛡️', category: 'Accessories' },
      { id: 206, name: 'Wireless Charger', price: 29.99, image: '🔋', category: 'Accessories' },
      { id: 207, name: 'Phone Stand', price: 12.99, image: '📱', category: 'Accessories' },
      { id: 208, name: 'Bluetooth Earbuds', price: 79.99, image: '🎧', category: 'Audio' },
      { id: 209, name: 'Power Bank', price: 39.99, image: '🔌', category: 'Accessories' },
      { id: 210, name: 'Phone Grip', price: 9.99, image: '📱', category: 'Accessories' },
    ],
  };

  /**
   * Get all products for a category
   */
  static getProductsByCategory(category: string): Product[] {
    return this.allProducts[category] || [];
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
}

