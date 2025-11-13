import express, { Application } from 'express';
import cors from 'cors';
import configRoutes from './routes/configRoutes';
import productRoutes from './routes/productRoutes';
import { userMiddleware } from './middleware/userMiddleware';

/**
 * Express application setup
 */
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userMiddleware); // Extract and log userId from query parameters

// Routes
app.use('/api', configRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;

