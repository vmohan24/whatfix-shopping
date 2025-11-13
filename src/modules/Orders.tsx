import { Link } from 'react-router-dom';
import './Module.css';

const Orders = () => {
  return (
    <div className="module-container">
      <h2>Orders</h2>
      <p>This is the Orders module (Micro-frontend)</p>
      <div className="module-content">
        <p>View your order history.</p>
        <Link to="/orders/payment" className="module-link">Go to Payment</Link>
      </div>
    </div>
  );
};

export default Orders;

