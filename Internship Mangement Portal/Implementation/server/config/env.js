import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: path.join(rootDir, '.env') });

function requireEnv(key, fallback) {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const PLACEHOLDER_PATTERN = /your_publishable_key|your_secret_key|replace_me/i;

function resolveClerkKey(...candidates) {
  for (const value of candidates) {
    if (value && !PLACEHOLDER_PATTERN.test(value)) {
      return value;
    }
  }
  return '';
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') !== 'production',
  isProd: process.env.NODE_ENV === 'production',
  rootDir,
  mongodbUri: requireEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/internhub'),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET', 'dev-access-secret-change-in-production'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  clerk: {
    secretKey: resolveClerkKey(process.env.CLERK_SECRET_KEY),
    publishableKey: resolveClerkKey(
      process.env.CLERK_PUBLISHABLE_KEY,
      process.env.VITE_CLERK_PUBLISHABLE_KEY,
    ),
  },
};
