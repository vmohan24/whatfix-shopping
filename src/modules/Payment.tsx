import { Link } from 'react-router-dom';
import './Module.css';

const Payment = () => {
  return (
    <div className="module-container">
      <h2>Payment</h2>
      <p>This is the Payment module (Micro-frontend)</p>
      <div className="module-content">
        <p>Process your payment.</p>
        <Link to="/orders" className="module-link">Back to Orders</Link>
      </div>
    </div>
  );
};

export default Payment;

