import mongoose from 'mongoose';
import { env } from './env.js';

const connectionOptions = {
  autoIndex: env.isDev,
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
};

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    const { host, name } = mongoose.connection;
    const isAtlas = env.mongodbUri.includes('mongodb+srv');
    console.log(`MongoDB connected [${isAtlas ? 'Atlas' : 'Local'}]: ${host}/${name}`);
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    if (!env.isProd) {
      console.warn('MongoDB disconnected');
    }
  });

  await mongoose.connect(env.mongodbUri, connectionOptions);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

export function getDatabaseStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    status: states[mongoose.connection.readyState] ?? 'unknown',
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
}
