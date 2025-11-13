// Model for Dashboard Configuration

import { InterestModel } from './Interest';

export interface NavItem {
  path: string;
  title: string;
}

export interface NavConfig {
  [key: string]: NavItem;
}

export interface DashboardConfig {
  headerConfig: NavConfig;
  leftNavConfig: NavConfig;
  secondaryConfig: NavConfig;
}

interface SubCategoryInterest {
  mainCategory: string;
  subCategory: string;
  visitCount: number;
}

// Data model - in a real application, this would come from a database
export class DashboardConfigModel {
  private static config: DashboardConfig = {
    headerConfig: {
      clothing: {
        path: "/shopping/clothing",
        title: "Clothing",
      },
      electronics: {
        path: "/shopping/electronics",
        title: "Electronics",
      },
      mobiles: {
        path: "/shopping/mobiles",
        title: "Mobiles",
      }
    },
    leftNavConfig: {
      profile: {
        path: "/profile",
        title: "Profile",
      },
      cart: {
        path: "/cart",
        title: "Cart",
      },
      orders: {
        path: "/orders",
        title: "Orders",
      }
    },
    secondaryConfig: {
      checkout: {
        path: "/cart/checkout",
        title: "Checkout",
      },
      payment: {
        path: "/orders/payment",
        title: "Payment",
      }
    }
  };

  static getConfig(): DashboardConfig {
    return this.config;
  }

  /**
   * Convert a subCategory name to a URL-friendly path segment
   */
  private static toUrlPathSegment(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '')  // Remove special characters
      .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
  }

  /**
   * Generate dynamic headerConfig based on user interests
   * - Always includes 3 main items (clothing, electronics, mobiles)
   * - Adds up to 3 subsections based on interest counts
   * - Total limit: 6 items
   * - Order: Clothing + subsections, Electronics + subsections, Mobiles + subsections
   */
  static generateDynamicHeaderConfig(userId: string): NavConfig {
    const headerConfig: NavConfig = {};
    const MAX_ITEMS = 6;

    // Main category definitions
    const mainCategories = [
      { key: 'clothing', title: 'Clothing', path: '/shopping/clothing' },
      { key: 'electronics', title: 'Electronics', path: '/shopping/electronics' },
      { key: 'mobiles', title: 'Mobiles', path: '/shopping/mobiles' }
    ];

    // Get aggregated interests
    const aggregatedInterests = InterestModel.getAggregatedInterests(userId);
    console.log(aggregatedInterests);
    // Collect all subsections with their interest counts
    const allSubsections: SubCategoryInterest[] = [];
    for (const [mainCategory, subCategoryMap] of aggregatedInterests.entries()) {
      for (const [subCategory, visitCount] of subCategoryMap.entries()) {
        allSubsections.push({
          mainCategory,
          subCategory,
          visitCount
        });
      }
    }

    // Sort subsections by visit count (descending) - highest first
    allSubsections.sort((a, b) => b.visitCount - a.visitCount);

    // Take top 3 subsections globally based on visitCount
    const MAIN_ITEMS_COUNT = 3;
    const MAX_SUBSECTIONS = MAX_ITEMS - MAIN_ITEMS_COUNT; // 3
    const topSubsections = allSubsections.slice(0, MAX_SUBSECTIONS);

    // Group the selected subsections by main category for ordered insertion
    const selectedSubsectionsByCategory = new Map<string, SubCategoryInterest[]>();
    for (const subsection of topSubsections) {
      if (!selectedSubsectionsByCategory.has(subsection.mainCategory)) {
        selectedSubsectionsByCategory.set(subsection.mainCategory, []);
      }
      selectedSubsectionsByCategory.get(subsection.mainCategory)!.push(subsection);
    }

    // Add main categories with their subsections immediately following each main category
    for (const mainCategory of mainCategories) {
      // Add main category
      headerConfig[mainCategory.key] = {
        path: mainCategory.path,
        title: mainCategory.title
      };

      // Add subsections for this main category immediately after
      const categorySubsections = selectedSubsectionsByCategory.get(mainCategory.key) || [];
      for (const subsection of categorySubsections) {
        const pathSegment = this.toUrlPathSegment(subsection.subCategory);
        const subsectionKey = `${mainCategory.key}_${pathSegment.replace(/-/g, '_')}`;
        
        headerConfig[subsectionKey] = {
          path: `/shopping/${mainCategory.key}/${pathSegment}`,
          title: subsection.subCategory
        };
      }
    }

    return headerConfig;
  }

  /**
   * Get config with dynamic headerConfig based on user interests
   */
  static getConfigForUser(userId: string): DashboardConfig {
    const dynamicHeaderConfig = this.generateDynamicHeaderConfig(userId);
    
    return {
      ...this.config,
      headerConfig: dynamicHeaderConfig
    };
  }

  static updateConfig(newConfig: DashboardConfig): void {
    this.config = newConfig;
  }
}

