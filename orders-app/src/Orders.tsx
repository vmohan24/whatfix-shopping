import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrdersAPI, Order } from './api';
import { formatDate, getStatusColor } from './helpers/order.helper';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders = await fetchOrdersAPI();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>
        <div className="orders-empty">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>
        <div className="orders-empty">
          <p>Error loading orders: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="continue-shopping-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>
        <div className="orders-empty">
          <p>You haven't placed any orders yet.</p>
          <button 
            onClick={() => navigate('/shopping/clothing')} 
            className="continue-shopping-button"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-header-left">
                <h2 className="order-id">Order #{order.id}</h2>
                <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-header-right">
                <span 
                  className="order-status"
                  style={{ color: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="order-total">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-image">
                    {item.product.image}
                  </div>
                  <div className="order-item-details">
                    <h3 className="order-item-name">{item.product.name}</h3>
                    <p className="order-item-category">{item.product.category}</p>
                    <p className="order-item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="order-summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span className="summary-label">Tax:</span>
                <span className="summary-value">${order.tax.toFixed(2)}</span>
              </div>
              <div className="order-summary-divider"></div>
              <div className="order-summary-row order-summary-total">
                <span className="summary-label">Total:</span>
                <span className="summary-value">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="order-shipping">
              <h3 className="shipping-title">Shipping Address</h3>
              <p className="shipping-address">
                {order.shippingInfo.fullName}<br />
                {order.shippingInfo.address}<br />
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}<br />
                {order.shippingInfo.country}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

