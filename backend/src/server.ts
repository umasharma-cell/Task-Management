import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/environment';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Core middleware
app.use(cors({ origin: env.cors.origin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

export default app;
