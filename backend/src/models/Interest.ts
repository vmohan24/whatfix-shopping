// Model for tracking user interests

import { ProductModel } from './Product';

export interface UserInterest {
  productId: number;
  visitCount: number;
}

/**
 * Interest tracking model - stores user interests in memory
 * Key: userId, Value: Map of productId -> visitCount
 */
export class InterestModel {
  // In-memory store: userId -> Map<productId, visitCount>
  private static interests: Map<string, Map<number, number>> = new Map();

  /**
   * Track a product view for a user
   * Increments the visit count for the given productId
   */
  static trackProductView(userId: string, productId: number): void {
    console.log('trackProductView', userId, productId);
    if (!userId) {
      return; // Skip tracking if no userId
    }

    if (!this.interests.has(userId)) {
      this.interests.set(userId, new Map());
    }

    const userInterests = this.interests.get(userId)!;
    const currentCount = userInterests.get(productId) || 0;
    userInterests.set(productId, currentCount + 1);
  }

  /**
   * Get all interests for a user
   */
  static getUserInterests(userId: string): UserInterest[] {
    console.log('getUserInterests', this.interests);
    if (!userId || !this.interests.has(userId)) {
      return [];
    }

    const userInterests = this.interests.get(userId)!;
    return Array.from(userInterests.entries()).map(([productId, visitCount]) => ({
      productId,
      visitCount
    }));
  }

  /**
   * Get aggregated interests by mainCategory and subCategory for a user
   * Returns: Map<mainCategory, Map<subCategory, totalVisitCount>>
   * Only looks up products that the user has shown interest in (efficient for large catalogs)
   */
  static getAggregatedInterests(userId: string): Map<string, Map<string, number>> {
    const aggregated = new Map<string, Map<string, number>>();
    const userInterests = this.getUserInterests(userId);

    // Only look up the specific products the user has shown interest in
    for (const interest of userInterests) {
      const result = ProductModel.findProductById(interest.productId);
      if (!result) continue;

      const { product, mainCategory } = result;

      if (!aggregated.has(mainCategory)) {
        aggregated.set(mainCategory, new Map());
      }

      const subCategoryMap = aggregated.get(mainCategory)!;
      const currentCount = subCategoryMap.get(product.subCategory) || 0;
      subCategoryMap.set(product.subCategory, currentCount + interest.visitCount);
    }

    return aggregated;
  }

  /**
   * Clear interests for a user (useful for testing)
   */
  static clearUserInterests(userId: string): void {
    this.interests.delete(userId);
  }
}

