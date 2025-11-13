import { Link } from 'react-router-dom';
import './Module.css';

const Checkout = () => {
  return (
    <div className="module-container">
      <h2>Checkout</h2>
      <p>This is the Checkout module (Micro-frontend)</p>
      <div className="module-content">
        <p>Complete your purchase.</p>
        <Link to="/cart" className="module-link">Back to Cart</Link>
      </div>
    </div>
  );
};

export default Checkout;

