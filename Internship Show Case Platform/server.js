const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { clerkMiddleware } = require('@clerk/express');
const config = require('./config');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware');
const {
  securityHeaders,
  globalLimiter,
  sanitizeRequest,
} = require('./middleware/security');

connectDB();

const app = express();
const clientDist = path.join(__dirname, 'client', 'dist');
const serveClient = fs.existsSync(path.join(clientDist, 'index.html'));

const clerkConfigured =
  Boolean(config.clerkPublishableKey) &&
  Boolean(config.clerkSecretKey) &&
  !config.clerkPublishableKey.includes('your_publishable_key') &&
  !config.clerkSecretKey.includes('your_secret_key');

app.disable('x-powered-by');
app.use(securityHeaders);

/**
 * Clerk should run early so auth state is available to all routes.
 * Keys come from process.env (loaded in config/) — do not pass secretKey
 * inline unless CLERK_ENCRYPTION_KEY is also set.
 */
if (clerkConfigured) {
  app.use(clerkMiddleware());
} else {
  console.warn(
    'Clerk keys are missing or still placeholders. Auth routes will reject requests until CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY are set.'
  );
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (
        config.nodeEnv === 'development' &&
        /localhost|127\.0\.0\.1/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeRequest);
app.use(globalLimiter);

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: config.nodeEnv === 'production' ? '7d' : 0,
    fallthrough: true,
  })
);

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Intern Project Showcase Platform API',
    version: '1.0.0',
    clerkConfigured,
    env: config.nodeEnv,
    fullstack: true,
  });
});

app.use('/api', apiRoutes);

/**
 * Full-stack mode: serve the Vite React build from the same Express process.
 * In development, Vite runs separately on :5173 and proxies /api + /uploads.
 */
if (serveClient) {
  app.use(express.static(clientDist, { index: false }));
  app.get(/^(?!\/api)(?!\/uploads).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message:
        'API is running. Build the client with "npm run build" to serve the full-stack app from this server, or use "npm run dev" for local development.',
      version: '1.0.0',
      clerkConfigured,
      env: config.nodeEnv,
    });
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(
    `Server running in ${config.nodeEnv} mode on port ${config.port}${
      serveClient ? ' (serving client/dist)' : ''
    }`
  );
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
