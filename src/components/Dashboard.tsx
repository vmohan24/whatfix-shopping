import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import LeftNav from './LeftNav';
import MainContainer from './MainContainer';
import { fetchDashboardConfig } from '../services/api';
import { DashboardConfig } from '../types/config';
import './Dashboard.css';

const Dashboard = () => {
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const dashboardConfig = await fetchDashboardConfig();
        setConfig(dashboardConfig);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="dashboard-error">
        <p>No configuration available</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="dashboard">
        <Header 
          headerConfig={config.headerConfig} 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className="dashboard-body">
          <LeftNav 
            leftNavConfig={config.leftNavConfig} 
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMenu={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MainContainer config={config} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Dashboard;

