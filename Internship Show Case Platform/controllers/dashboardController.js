const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const PortfolioSettings = require('../models/PortfolioSettings');
const ViewEvent = require('../models/ViewEvent');

const dayKey = (date) => date.toISOString().slice(0, 10);

/**
 * @desc    Dashboard statistics for the signed-in intern
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const clerkId = req.clerkId;

  const [user, profile, projects, settings, projectViewsAgg] = await Promise.all([
    User.findOne({ clerkId }).select('fullName email profileImage role'),
    Profile.findOne({ clerkId }),
    Project.find({ clerkId })
      .sort({ updatedAt: -1 })
      .select(
        'title shortDescription images category viewCount technologies createdAt updatedAt'
      )
      .limit(6)
      .lean(),
    PortfolioSettings.findOne({ clerkId }),
    Project.aggregate([
      { $match: { clerkId } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalProjectViews: { $sum: '$viewCount' },
        },
      },
    ]),
  ]);

  if (!user) {
    throw new AppError('User not found. Sync auth first.', 404);
  }

  const totals = projectViewsAgg[0] || {
    totalProjects: 0,
    totalProjectViews: 0,
  };

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [portfolioViews7d, projectViews7d] = await Promise.all([
    ViewEvent.countDocuments({
      ownerClerkId: clerkId,
      type: 'portfolio',
      createdAt: { $gte: since },
    }),
    ViewEvent.countDocuments({
      ownerClerkId: clerkId,
      type: 'project',
      createdAt: { $gte: since },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
      },
      profile,
      completionPercent: profile?.completionPercent || 0,
      stats: {
        totalProjects: totals.totalProjects,
        totalProjectViews: totals.totalProjectViews || 0,
        portfolioViews: settings?.portfolioViews || 0,
        portfolioViews7d,
        projectViews7d,
        portfolioStatus: settings?.portfolioStatus || 'draft',
        username: settings?.username || null,
        publicUrl: settings?.username ? `/portfolio/${settings.username}` : null,
      },
      recentProjects: projects.map((project) => ({
        id: project._id,
        title: project.title,
        shortDescription: project.shortDescription,
        images: project.images || [],
        category: project.category,
        viewCount: project.viewCount || 0,
        technologies: project.technologies || [],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
      quickActions: [
        { label: 'Add project', href: '/projects/new' },
        { label: 'Edit portfolio', href: '/portfolio' },
        { label: 'Edit profile', href: '/profile/edit' },
        { label: 'Account settings', href: '/settings' },
      ],
    },
  });
});

/**
 * @desc    Analytics time-series for portfolio & project views
 * @route   GET /api/dashboard/analytics?days=14
 * @access  Private
 */
const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const days = Math.min(
    90,
    Math.max(7, Number.parseInt(req.query.days, 10) || 14)
  );
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const rows = await ViewEvent.aggregate([
    {
      $match: {
        ownerClerkId: req.clerkId,
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: {
          day: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          type: '$type',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.day': 1 } },
  ]);

  const seriesMap = new Map();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = dayKey(d);
    seriesMap.set(key, { date: key, portfolio: 0, project: 0 });
  }

  rows.forEach((row) => {
    const entry = seriesMap.get(row._id.day);
    if (!entry) return;
    if (row._id.type === 'portfolio') entry.portfolio = row.count;
    if (row._id.type === 'project') entry.project = row.count;
  });

  const series = Array.from(seriesMap.values());
  const totals = series.reduce(
    (acc, day) => {
      acc.portfolio += day.portfolio;
      acc.project += day.project;
      return acc;
    },
    { portfolio: 0, project: 0 }
  );

  const topProjects = await Project.find({ clerkId: req.clerkId })
    .sort({ viewCount: -1 })
    .limit(5)
    .select('title viewCount category images')
    .lean();

  res.status(200).json({
    success: true,
    data: {
      days,
      series,
      totals,
      topProjects: topProjects.map((project) => ({
        id: project._id,
        title: project.title,
        viewCount: project.viewCount || 0,
        category: project.category,
        images: project.images || [],
      })),
    },
  });
});

module.exports = {
  getDashboardStats,
  getDashboardAnalytics,
};
