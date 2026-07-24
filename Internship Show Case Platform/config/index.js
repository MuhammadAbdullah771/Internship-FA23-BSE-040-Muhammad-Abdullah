require('dotenv').config();

const requiredInProduction = [
  'MONGODB_URI',
  'CLIENT_URL',
  'CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(
      `Missing required production environment variables: ${missing.join(', ')}`
    );
    process.exit(1);
  }
}

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intern_showcase',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
};

/** Allowed browser origins for CORS */
config.corsOrigins = [
  config.clientUrl,
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
];

if (config.nodeEnv !== 'production') {
  config.corsOrigins.push(
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:4173',
    'http://127.0.0.1:4173'
  );
}

config.corsOrigins = [...new Set(config.corsOrigins.filter(Boolean))];

module.exports = config;
