import React, { lazy, Suspense, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardConfig } from '../types/config';
import { extractCategoryFromPath, getDefaultRedirectPath } from '../helpers/routes.helper';
import './MainContainer.css';

// Lazy load module components (these would be micro-frontends in production)
const ProductCategory = lazy(() => import('clothing_app/ProductCategory'));
const ProductDetail = lazy(() => import('clothing_app/ProductDetail'));

const Profile = lazy(() => import('../modules/Profile'));
const Cart = lazy(() => import('../modules/Cart'));
const Orders = lazy(() => import('../modules/Orders'));
const Checkout = lazy(() => import('../modules/Checkout'));
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
          
          {/* Shopping category routes from headerConfig */}
          {Object.entries(config.headerConfig || {}).map(([key, navItem]) => {
            const category = extractCategoryFromPath(navItem.path);
            // Only render if we have a valid category
            if (!category) return null;
            return (
              <Route
                key={key}
                path={navItem.path}
                element={<ProductCategory category={category} />}
              />
            );
          })}
          
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

