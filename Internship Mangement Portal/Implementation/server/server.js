import http from 'http';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

let server;

function listen(app) {
  return new Promise((resolve, reject) => {
    const instance = http.createServer(app);

    instance.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        reject(new Error(
          `Port ${env.port} is already in use.\n`
          + `  • Stop the other process, or run: npx kill-port ${env.port}\n`
          + `  • Or set a different PORT in your .env file`,
        ));
        return;
      }
      reject(error);
    });

    instance.listen(env.port, () => resolve(instance));
  });
}

async function shutdown(signal) {
  console.log(`\n${signal} received — shutting down...`);

  const closeServer = new Promise((resolve) => {
    if (!server) return resolve();
    server.close(() => resolve());
  });

  await closeServer;
  await disconnectDatabase().catch(() => {});
  process.exit(0);
}

async function start() {
  await connectDatabase();

  const app = createApp();
  server = await listen(app);

  const mode = env.isProd ? 'production (API + React)' : 'API only';
  console.log(`InternHub server [${mode}] → http://localhost:${env.port}`);
  if (env.isDev) {
    console.log(`React dev UI → ${env.clientUrl}`);
    console.log(`Tip: open ${env.clientUrl} in your browser (port ${env.port} is API-only in dev).`);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch(async (error) => {
  console.error('Failed to start server:', error.message);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
