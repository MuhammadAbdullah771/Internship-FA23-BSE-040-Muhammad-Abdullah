import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { getDatabaseStatus } from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import internRoutes from './modules/interns/interns.routes.js';
import taskRoutes from './modules/tasks/tasks.routes.js';
import internshipRoutes from './modules/internships/internships.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(helmet({
    contentSecurityPolicy: env.isProd ? undefined : false,
  }));

  if (env.isDev) {
    app.use(cors({ origin: env.corsOrigin, credentials: true }));
  }

  app.use(express.json({ limit: '10kb' }));
  app.use(morgan(env.isDev ? 'dev' : 'combined'));

  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      message: 'InternHub is running',
      env: env.nodeEnv,
      database: getDatabaseStatus(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/interns', internRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/internships', internshipRoutes);

  if (env.isProd) {
    const distPath = path.join(env.rootDir, 'dist');
    app.use(express.static(distPath));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
