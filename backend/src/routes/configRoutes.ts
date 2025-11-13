import { Router } from 'express';
import { ConfigController } from '../controllers/configController';

const router = Router();

/**
 * @route   GET /api/config
 * @desc    Get dashboard configuration
 * @access  Public
 */
router.get('/config', ConfigController.getConfig);

export default router;

