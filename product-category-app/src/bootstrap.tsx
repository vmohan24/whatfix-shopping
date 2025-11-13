import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import ProductCategory from './ProductCategory';
import ProductDetail from './ProductDetail';
import { getStore } from './storeUtils';

// Get store (real or dummy) - always returns a store
const store = getStore();

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/shopping/clothing" replace />} />
      <Route path="/shopping/:category" element={<ProductCategory />} />
      <Route path="/shopping/:category/:subCategory" element={<ProductCategory />} />
      <Route path="/shopping/:category/:productId" element={<ProductDetail />} />
      <Route path="*" element={<Navigate to="/shopping/clothing" replace />} />
    </Routes>
  </BrowserRouter>
);

// Always wrap with Provider - store will be real or dummy
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

