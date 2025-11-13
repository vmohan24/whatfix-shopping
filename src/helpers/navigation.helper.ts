/**
 * Navigation-related helper functions
 */

import { NavConfig } from '../types/config';

/**
 * Check if a path is active based on the current location
 * Handles exact matches and nested routes, ensuring only the most specific match is active
 */
export const isActive = (path: string, locationPathname: string, headerConfig: NavConfig): boolean => {
  // Exact match
  if (locationPathname === path) return true;
  
  // Check if pathname starts with the config path followed by a slash
  if (!locationPathname.startsWith(path + '/')) return false;
  
  // Only mark as active if there's no longer path that also matches
  // This ensures only the most specific (deepest) matching path is active
  const hasLongerMatch = Object.values(headerConfig).some(config => {
    const otherPath = config.path;
    // Skip the current path
    if (otherPath === path) return false;
    // Check if there's a longer path that also matches
    return otherPath.length > path.length && 
           (locationPathname === otherPath || locationPathname.startsWith(otherPath + '/'));
  });
  
  return !hasLongerMatch;
};

