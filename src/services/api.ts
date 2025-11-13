import { DashboardConfig } from '../types/config';

const API_BASE_URL = 'http://localhost:4001';

interface ApiResponse {
  success: boolean;
  data?: DashboardConfig;
  message?: string;
  error?: string;
}

// API service to fetch dashboard configuration from backend
export const fetchDashboardConfig = async (): Promise<DashboardConfig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse = await response.json();    
    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch configuration');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    throw error;
  }
};

