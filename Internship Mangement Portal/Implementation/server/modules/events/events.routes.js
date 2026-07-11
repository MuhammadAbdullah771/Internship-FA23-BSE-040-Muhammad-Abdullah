import { Router } from 'express';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { verifyAccessToken } from '../../utils/jwt.js';
import { User } from '../../models/User.js';
import { env } from '../../config/env.js';
import { addSubscriber } from './eventBus.js';

const router = Router();

const clerkClient = env.clerk.secretKey?.startsWith('sk_')
  ? createClerkClient({ secretKey: env.clerk.secretKey, publishableKey: env.clerk.publishableKey })
  : null;

async function resolveUserFromToken(token) {
  if (!token) return null;

  // App JWTs (superadmin) use HS256 — skip Clerk to avoid jwk-kid-mismatch noise.
  try {
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf8'));
    if (header?.alg === 'HS256') {
      const payload = verifyAccessToken(token);
      return User.findById(payload.sub);
    }
  } catch {
    // continue
  }

  if (clerkClient) {
    try {
      const payload = await verifyToken(token, {
        secretKey: env.clerk.secretKey,
        clockSkewInMs: env.isDev ? 120_000 : 10_000,
      });
      const user = await User.findOne({ clerkId: payload.sub });
      if (user) return user;
    } catch {
      // fall through to JWT
    }
  }

  try {
    const payload = verifyAccessToken(token);
    return User.findById(payload.sub);
  } catch {
    return null;
  }
}

router.get('/stream', async (req, res) => {
  const token = req.query.token;
  const user = await resolveUserFromToken(typeof token === 'string' ? token : '');

  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  addSubscriber(res, {
    userId: user._id.toString(),
    role: user.role,
  });

  res.write(`event: connected\ndata: ${JSON.stringify({ userId: user._id.toString(), role: user.role })}\n\n`);

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 25000);

  res.on('close', () => clearInterval(heartbeat));
});

export default router;
