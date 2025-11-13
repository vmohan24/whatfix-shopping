// Model for Dashboard Configuration

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

  static updateConfig(newConfig: DashboardConfig): void {
    this.config = newConfig;
  }
}

