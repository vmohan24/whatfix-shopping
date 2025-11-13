import { Link, useLocation } from 'react-router-dom';
import { NavConfig } from '../types/config';
import './LeftNav.css';

interface LeftNavProps {
  leftNavConfig: NavConfig | null;
  isMobileMenuOpen?: boolean;
  onCloseMenu?: () => void;
}

const LeftNav = ({ leftNavConfig, isMobileMenuOpen, onCloseMenu }: LeftNavProps) => {
  const location = useLocation();

  if (!leftNavConfig) {
    return null;
  }

  const handleLinkClick = () => {
    if (onCloseMenu) {
      onCloseMenu();
    }
  };

  return (
    <aside className={`left-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <nav className="left-nav-menu">
        {Object.entries(leftNavConfig).map(([key, config]) => (
          <Link
            key={key}
            to={config.path}
            className={`left-nav-item ${location.pathname === config.path ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {config.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default LeftNav;

