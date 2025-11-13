import { Product } from './products';
import { getCurrentUserId } from './userService';

const API_BASE_URL = 'http://localhost:4001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Fetch all products for a specific category
 */
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const userId = getCurrentUserId();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['userId'] = userId;
    }
    const response = await fetch(`${API_BASE_URL}/api/products/${category}`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Product[]> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch products');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch products by category and subcategory
 */
export const fetchProductsByCategoryAndSubCategory = async (category: string, subCategory: string): Promise<Product[]> => {
  try {
    const userId = getCurrentUserId();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['userId'] = userId;
    }
    const response = await fetch(`${API_BASE_URL}/api/products/${category}/${subCategory}`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Product[]> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch products');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by category and id
 */
export const fetchProductById = async (category: string, productId: number): Promise<Product> => {
  try {
    const userId = getCurrentUserId();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['userId'] = userId;
    }
    const response = await fetch(`${API_BASE_URL}/api/products/${category}/${productId}`, {
      headers,
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Product> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch product');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

