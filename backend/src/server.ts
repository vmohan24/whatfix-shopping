import app from './app';

const PORT = process.env.PORT || 4001;

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/config`);
});

