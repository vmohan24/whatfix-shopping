import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, CartItem, fetchCartAsync, clearCart } from 'shopping_dashboard/store';
import { createOrderAPI } from './api';
import { calculateSubtotal, calculateTax, calculateTotal } from './helpers/checkout.helper';
import { DEFAULT_COUNTRY, ORDER_REDIRECT_DELAY } from './constants/checkout.constants';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);
  const user = useSelector((state: RootState) => state.user.user);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: DEFAULT_COUNTRY,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Fetch cart from backend on mount
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);


  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || 
        !shippingInfo.state || !shippingInfo.zipCode) {
      alert('Please fill in all shipping information');
      return;
    }

    // Validate payment info
    if (!paymentInfo.cardNumber || !paymentInfo.cardName || 
        !paymentInfo.expiryDate || !paymentInfo.cvv) {
      alert('Please fill in all payment information');
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      // Create order in backend
      await createOrderAPI(shippingInfo, paymentInfo);
      
      // Clear cart after successful order creation
      dispatch(clearCart());
      setOrderPlaced(true);
      
      // Redirect to orders after delay
      setTimeout(() => {
        navigate('/orders');
      }, ORDER_REDIRECT_DELAY);
    } catch (error) {
      console.error('Failed to place order:', error);
      setOrderError(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-empty">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-empty">
          <p>Error loading cart: {error}</p>
          <button 
            onClick={() => dispatch(fetchCartAsync())} 
            className="continue-shopping-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-empty">
          <p>Your cart is empty</p>
          <button 
            onClick={() => navigate('/cart')} 
            className="continue-shopping-button"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-title">Order Placed!</h1>
        <div className="checkout-empty">
          <p>Thank you for your order. Redirecting to orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-content">
        <div className="checkout-forms">
          {/* Shipping Information */}
          <div className="checkout-section">
            <h2 className="section-title">Shipping Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                  required
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="checkout-section">
            <h2 className="section-title">Payment Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={paymentInfo.cardName}
                  onChange={handlePaymentChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handlePaymentChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentChange}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2 className="section-title">Order Summary</h2>
          
          <div className="order-items">
            {cartItems.map((item: CartItem) => (
              <div key={item.product.id} className="order-item">
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

          <div className="order-summary-totals">
            <div className="summary-row">
              <span className="summary-label">Subtotal:</span>
              <span className="summary-value">${calculateSubtotal(cartItems).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tax:</span>
              <span className="summary-value">${calculateTax(calculateSubtotal(cartItems)).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping:</span>
              <span className="summary-value">Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span className="summary-label">Total:</span>
              <span className="summary-value">${calculateTotal(cartItems).toFixed(2)}</span>
            </div>
          </div>

          {orderError && (
            <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
              {orderError}
            </div>
          )}
          <button
            onClick={handlePlaceOrder}
            className="place-order-button"
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="back-to-cart-button"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

