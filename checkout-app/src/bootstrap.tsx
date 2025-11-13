import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'shopping_dashboard/store';
import Checkout from './Checkout';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

