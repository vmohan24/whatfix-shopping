import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Clothing from './Clothing';
import ProductDetail from './ProductDetail';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/shopping/:category" element={<Clothing />} />
        <Route path="/shopping/:category/:productId" element={<ProductDetail />} />
        <Route path="*" element={<Clothing />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

