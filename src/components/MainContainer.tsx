import React, { lazy, Suspense, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardConfig } from '../types/config';
import { extractCategoryFromPath, getDefaultRedirectPath } from '../helpers/routes.helper';
import './MainContainer.css';

// Lazy load module components (these would be micro-frontends in production)
const ProductCategory = lazy(() => import('product_category_app/ProductCategory'));
const ProductDetail = lazy(() => import('product_category_app/ProductDetail'));
const Cart = lazy(() => import('cart_app/Cart'));
const Checkout = lazy(() => import('checkout_app/Checkout'));
const Orders = lazy(() => import('orders_app/Orders'));

const Profile = lazy(() => import('../modules/Profile'));
const Payment = lazy(() => import('../modules/Payment'));

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading module...</p>
  </div>
);

interface MainContainerProps {
  config: DashboardConfig;
}

const MainContainer = ({ config }: MainContainerProps) => {
  // Get default redirect path - try headerConfig first, then leftNavConfig
  const defaultRedirectPath = useMemo(() => {
    return getDefaultRedirectPath(config);
  }, [config]);

  // Component mapping for different route types
  const componentMap: Record<string, React.LazyExoticComponent<any>> = {
    profile: Profile,
    cart: Cart,
    orders: Orders,
    checkout: Checkout,
    payment: Payment,
  };

  return (
    <main className="main-container">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Root redirect to first available route, or show message if none available */}
          {defaultRedirectPath ? (
            <Route path="/" element={<Navigate to={defaultRedirectPath} replace />} />
          ) : (
            <Route path="/" element={<div className="not-found no-config-message">Its not you, but its us. We forgot to add configurations to the app. :'(</div>} />
          )}
          
          {/* Shopping category routes from headerConfig - only for paths without subcategories */}
          {Object.entries(config.headerConfig || {}).map(([key, navItem]) => {
            // Only create specific routes for paths that are exactly /shopping/:category
            // Paths with subcategories (/shopping/:category/:subCategory) will be handled by the dynamic route below
            const pathParts = navItem.path.split('/').filter(part => part.length > 0);
            if (pathParts.length !== 2 || pathParts[0] !== 'shopping') {
              // Skip this route - it will be handled by dynamic routes below
              return null;
            }
            const category = pathParts[1];
            if (!category) return null;
            return (
              <Route
                key={key}
                path={navItem.path}
                element={<ProductCategory category={category} />}
              />
            );
          })}
          
          {/* Category with subcategory route (must come before productId route) */}
          <Route path="/shopping/:category/:subCategory" element={<ProductCategory />} />
          
          {/* Product detail route (dynamic) */}
          <Route path="/shopping/:category/:productId" element={<ProductDetail />} />
          
          {/* Left navigation routes */}
          {Object.entries(config.leftNavConfig || {}).map(([key, navItem]) => {
            const Component = componentMap[key];
            if (!Component) return null;
            return (
              <Route
                key={key}
                path={navItem.path}
                element={<Component />}
              />
            );
          })}
          
          {/* Secondary routes (checkout, payment) */}
          {Object.entries(config.secondaryConfig || {}).map(([key, navItem]) => {
            const Component = componentMap[key];
            if (!Component) return null;
            return (
              <Route
                key={key}
                path={navItem.path}
                element={<Component />}
              />
            );
          })}
          
          {/* 404 route */}
          <Route path="*" element={<div className="not-found">Module not found</div>} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default MainContainer;

