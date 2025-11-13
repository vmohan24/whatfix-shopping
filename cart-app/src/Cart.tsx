import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, CartItem, updateCartItemAsync, removeFromCartAsync, fetchCartAsync } from 'shopping_dashboard/store';
import { calculateTotal } from './helpers/cart.helper';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  // Fetch cart from backend on mount
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCartAsync(productId));
    } else {
      dispatch(updateCartItemAsync({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCartAsync(productId));
  };

  const handleCheckout = () => {
    navigate('/cart/checkout');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="cart-empty">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="cart-empty">
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

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <button 
            onClick={() => navigate('/shopping/clothing')} 
            className="continue-shopping-button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item: CartItem) => (
            <div key={item.product.id} className="cart-item">
              <div className="cart-item-image">
                {item.product.image}
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.product.name}</h3>
                <p className="cart-item-category">{item.product.category}</p>
                <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
              </div>
              
              <div className="cart-item-quantity">
                <label htmlFor={`quantity-${item.product.id}`}>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="quantity-button"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    id={`quantity-${item.product.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      handleQuantityChange(item.product.id, val);
                    }}
                    className="quantity-input"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="cart-item-total">
                <p className="item-total-label">Item Total:</p>
                <p className="item-total-price">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.product.id)}
                className="remove-item-button"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="cart-summary-content">
            <div className="cart-summary-row">
              <span className="summary-label">Subtotal:</span>
              <span className="summary-value">${calculateTotal(cartItems).toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="summary-label">Shipping:</span>
              <span className="summary-value">Free</span>
            </div>
            <div className="cart-summary-divider"></div>
            <div className="cart-summary-row cart-summary-total">
              <span className="summary-label">Total:</span>
              <span className="summary-value">${calculateTotal(cartItems).toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

