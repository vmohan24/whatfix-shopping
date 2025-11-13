import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { NavConfig } from '../types/config';
import './LeftNav.css';

interface LeftNavProps {
  leftNavConfig: NavConfig | null;
  isMobileMenuOpen?: boolean;
  onCloseMenu?: () => void;
}

const LeftNav = ({ leftNavConfig, isMobileMenuOpen, onCloseMenu }: LeftNavProps) => {
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!leftNavConfig) {
    return null;
  }

  return (
    <aside className={`left-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <nav className="left-nav-menu">
        {Object.entries(leftNavConfig).map(([key, config]) => (
          <Link
            key={key}
            to={config.path}
            className={`left-nav-item ${location.pathname === config.path ? 'active' : ''}`}
            onClick={onCloseMenu}
          >
            <span className="left-nav-item-title">{config.title}</span>
            {key === 'cart' && cartItemCount > 0 && (
              <span className="left-nav-cart-badge">{cartItemCount}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default LeftNav;

