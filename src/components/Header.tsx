import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { NavConfig } from '../types/config';
import './Header.css';

interface HeaderProps {
  headerConfig: NavConfig | null;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Header = ({ headerConfig, onMenuToggle, isMobileMenuOpen }: HeaderProps) => {
  const location = useLocation();

  if (!headerConfig) {
    return null;
  }

  const isActive = (path: string) => {
    // Exact match
    if (location.pathname === path) return true;
    
    // Check if pathname starts with the config path followed by a slash
    if (!location.pathname.startsWith(path + '/')) return false;
    
    // Only mark as active if there's no longer path that also matches
    // This ensures only the most specific (deepest) matching path is active
    const hasLongerMatch = Object.values(headerConfig).some(config => {
      const otherPath = config.path;
      // Skip the current path
      if (otherPath === path) return false;
      // Check if there's a longer path that also matches
      return otherPath.length > path.length && 
             (location.pathname === otherPath || location.pathname.startsWith(otherPath + '/'));
    });
    
    return !hasLongerMatch;
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-left">
          <button 
            className="mobile-menu-button"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <span className={classNames('hamburger', { active: isMobileMenuOpen })}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <h1 className="header-logo">Whatfix Shopping</h1>
        </div>
        <nav className="header-nav">
          {Object.entries(headerConfig).map(([key, config]) => (
            <Link
              key={key}
              to={config.path}
              className={classNames('header-nav-item', { active:  isActive(config.path) })}
            >
              {config.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

