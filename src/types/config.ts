// Type definitions for dashboard configuration

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

