import { Link } from 'react-router-dom';
import './Module.css';

const Cart = () => {
  return (
    <div className="module-container">
      <h2>Cart</h2>
      <p>This is the Cart module (Micro-frontend)</p>
      <div className="module-content">
        <p>View items in your shopping cart.</p>
        <Link to="/cart/checkout" className="module-link">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default Cart;

