import { Request, Response } from 'express';
import { DashboardConfigModel } from '../models/DashboardConfig';

/**
 * Controller for handling dashboard configuration requests
 */
export class ConfigController {
  /**
   * Get dashboard configuration
   * GET /api/config
   */
  static async getConfig(req: Request, res: Response): Promise<void> {
    try {
      // Simulate a small delay to mimic real API behavior
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const config = DashboardConfigModel.getConfig();
      
      res.status(200).json({
        success: true,
        data: config
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard configuration',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

