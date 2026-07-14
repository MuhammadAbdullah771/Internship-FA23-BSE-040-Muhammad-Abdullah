const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { clerkMiddleware } = require('@clerk/express');
const config = require('./config');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware');

connectDB();

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin) and known frontend URLs
      if (!origin || config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (config.nodeEnv === 'development' && /localhost|127\.0\.0\.1/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

const clerkConfigured =
  Boolean(config.clerkPublishableKey) &&
  Boolean(config.clerkSecretKey) &&
  !config.clerkPublishableKey.includes('your_publishable_key') &&
  !config.clerkSecretKey.includes('your_secret_key');

if (clerkConfigured) {
  app.use(
    clerkMiddleware({
      publishableKey: config.clerkPublishableKey,
      secretKey: config.clerkSecretKey,
    })
  );
} else {
  console.warn(
    'Clerk keys are missing or still placeholders. Auth routes will reject requests until CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY are set.'
  );
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Intern Project Showcase Platform API',
    version: '1.0.0',
    clerkConfigured,
  });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(
    `Server running in ${config.nodeEnv} mode on port ${config.port}`
  );
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
