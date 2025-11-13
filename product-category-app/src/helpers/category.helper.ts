/**
 * Category-related helper functions
 */

/**
 * Get category title from category string
 */
export const getCategoryTitle = (category?: string): string => {
  switch (category) {
    case 'electronics':
      return 'Electronics';
    case 'mobiles':
      return 'Mobiles';
    case 'clothing':
    default:
      return 'Clothing';
  }
};

/**
 * Get category placeholder text for search input
 */
export const getCategoryPlaceholder = (category?: string): string => {
  switch (category) {
    case 'electronics':
      return 'Search for electronic items...';
    case 'mobiles':
      return 'Search for mobile phones...';
    case 'clothing':
    default:
      return 'Search for clothing items...';
  }
};

/**
 * Get category path for navigation
 */
export const getCategoryPath = (cat?: string): string => {
  switch (cat) {
    case 'electronics':
      return '/shopping/electronics';
    case 'mobiles':
      return '/shopping/mobiles';
    case 'clothing':
    default:
      return '/shopping/clothing';
  }
};

