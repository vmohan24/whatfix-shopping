import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductCategory from './ProductCategory';
import ProductDetail from './ProductDetail';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/shopping/:category" element={<ProductCategory />} />
        <Route path="/shopping/:category/:productId" element={<ProductDetail />} />
        <Route path="*" element={<ProductCategory />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

