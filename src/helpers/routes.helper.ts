import { DashboardConfig } from '../types/config';

/**
 * Extract category name from path (e.g., "/shopping/clothing" -> "clothing")
 */
export const extractCategoryFromPath = (path: string): string => {
  const parts = path.split('/').filter(part => part.length > 0);
  return parts[parts.length - 1] || '';
};

/**
 * Get default redirect path - try headerConfig first, then leftNavConfig
 * Returns the first available route path, or null if none available
 */
export const getDefaultRedirectPath = (config: DashboardConfig): string | null => {
  // Try to get first route from headerConfig
  const headerRoutes = Object.values(config.headerConfig || {});
  if (headerRoutes.length > 0 && headerRoutes[0]?.path) {
    return headerRoutes[0].path;
  }
  
  // Fallback to first route from leftNavConfig
  const leftNavRoutes = Object.values(config.leftNavConfig || {});
  if (leftNavRoutes.length > 0 && leftNavRoutes[0]?.path) {
    return leftNavRoutes[0].path;
  }
  
  // If no routes available, return null to show a message instead of redirecting
  return null;
};

