const crypto = require('crypto');
const ViewEvent = require('../models/ViewEvent');
const PortfolioSettings = require('../models/PortfolioSettings');
const Project = require('../models/Project');

const hashVisitor = (req) => {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  const ua = req.headers['user-agent'] || '';
  const day = new Date().toISOString().slice(0, 10);
  return crypto
    .createHash('sha256')
    .update(`${ip}|${ua}|${day}`)
    .digest('hex')
    .slice(0, 32);
};

/**
 * Record a view once per visitorKey per target per day (best-effort).
 * Never throws to callers — analytics must not break public pages.
 */
const trackView = async ({ type, ownerClerkId, targetKey, projectId = null, req }) => {
  try {
    if (!ownerClerkId || !targetKey || !type) return;

    const visitorKey = req ? hashVisitor(req) : '';
    const since = new Date(Date.now() - 12 * 60 * 60 * 1000);

    if (visitorKey) {
      const existing = await ViewEvent.findOne({
        type,
        targetKey,
        visitorKey,
        createdAt: { $gte: since },
      })
        .select('_id')
        .lean();
      if (existing) return;
    }

    await ViewEvent.create({
      type,
      ownerClerkId,
      targetKey,
      project: projectId || null,
      visitorKey,
    });

    if (type === 'portfolio') {
      await PortfolioSettings.updateOne(
        { clerkId: ownerClerkId },
        { $inc: { portfolioViews: 1 } }
      );
    }

    if (type === 'project' && projectId) {
      await Project.updateOne({ _id: projectId }, { $inc: { viewCount: 1 } });
    }
  } catch (error) {
    console.error('trackView failed:', error.message);
  }
};

module.exports = {
  trackView,
  hashVisitor,
};
