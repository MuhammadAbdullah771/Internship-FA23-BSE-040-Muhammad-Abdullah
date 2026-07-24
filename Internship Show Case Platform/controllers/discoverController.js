const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const PortfolioSettings = require('../models/PortfolioSettings');
const mongoose = require('mongoose');
const { trackView } = require('../utils/analytics');

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(','))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const parsePagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(query.limit, 10) || DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getPublishedPortfolios = async () => {
  const settings = await PortfolioSettings.find({
    portfolioStatus: 'published',
    username: { $exists: true, $nin: [null, ''] },
  })
    .select('clerkId username customHeadline primaryColor theme')
    .lean();

  return settings;
};

const toDiscoveryProject = (project, owner = {}) => ({
  id: project._id,
  title: project.title,
  shortDescription: project.shortDescription,
  images: project.images || [],
  technologies: project.technologies || [],
  tags: project.tags || [],
  category: project.category,
  githubUrl: project.githubUrl || '',
  liveDemoUrl: project.liveDemoUrl || '',
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  intern: {
    fullName: owner.fullName || 'Intern',
    professionalTitle: owner.professionalTitle || '',
    profileImage: owner.profileImage || '',
    username: owner.username || null,
    location: owner.location || '',
  },
});

const toDiscoveryIntern = (profile, settings, extras = {}) => ({
  username: settings.username,
  fullName: profile.fullName,
  professionalTitle: profile.professionalTitle || '',
  profileImage: profile.profileImage || '',
  bio: (profile.bio || '').slice(0, 220),
  location: profile.location || '',
  skills: profile.skills || [],
  university: profile.university || '',
  customHeadline: settings.customHeadline || '',
  projectCount: extras.projectCount || 0,
  portfolioUrl: `/portfolio/${settings.username}`,
});

/**
 * @desc    Search / filter / paginate public projects (published portfolios only)
 * @route   GET /api/explore/projects
 * @access  Public
 */
const searchProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const q = String(req.query.q || req.query.search || '').trim();
  const title = String(req.query.title || '').trim();
  const internName = String(req.query.name || req.query.intern || '').trim();
  const category = String(req.query.category || '').trim();
  const technologies = parseList(req.query.technology || req.query.technologies);
  const skills = parseList(req.query.skill || req.query.skills);
  const sortKey = String(req.query.sort || 'newest').toLowerCase();

  const published = await getPublishedPortfolios();
  if (!published.length) {
    return res.status(200).json({
      success: true,
      data: {
        projects: [],
        pagination: { page, limit, total: 0, pages: 0 },
        filters: { categories: Project.CATEGORIES },
      },
    });
  }

  const usernameByClerk = new Map(
    published.map((item) => [item.clerkId, item.username])
  );
  let clerkIds = published.map((item) => item.clerkId);

  // Optional: narrow by intern name / skills via Profile first
  if (internName || skills.length) {
    const profileQuery = {
      clerkId: { $in: clerkIds },
    };
    if (internName) {
      profileQuery.fullName = {
        $regex: escapeRegex(internName),
        $options: 'i',
      };
    }
    if (skills.length) {
      profileQuery.skills = {
        $all: skills.map((skill) => new RegExp(`^${escapeRegex(skill)}$`, 'i')),
      };
    }
    const matchedProfiles = await Profile.find(profileQuery)
      .select('clerkId')
      .lean();
    clerkIds = matchedProfiles.map((profile) => profile.clerkId);
    if (!clerkIds.length) {
      return res.status(200).json({
        success: true,
        data: {
          projects: [],
          pagination: { page, limit, total: 0, pages: 0 },
          filters: { categories: Project.CATEGORIES },
        },
      });
    }
  }

  const filter = { clerkId: { $in: clerkIds } };

  if (category && Project.CATEGORIES.includes(category)) {
    filter.category = category;
  }

  if (technologies.length) {
    filter.technologies = {
      $all: technologies.map(
        (tech) => new RegExp(`^${escapeRegex(tech)}$`, 'i')
      ),
    };
  }

  if (title) {
    filter.title = { $regex: escapeRegex(title), $options: 'i' };
  }

  let useTextScore = false;
  if (q) {
    // Prefer text index when present; fall back to regex OR
    filter.$text = { $search: q };
    useTextScore = true;
  }

  let sort = { createdAt: -1 };
  if (sortKey === 'oldest') sort = { createdAt: 1 };
  else if (sortKey === 'title') sort = { title: 1 };
  else if (sortKey === 'relevance' && useTextScore) {
    sort = { score: { $meta: 'textScore' } };
  } else if (useTextScore && sortKey === 'newest') {
    sort = { score: { $meta: 'textScore' }, createdAt: -1 };
  }

  const projection = useTextScore
    ? { score: { $meta: 'textScore' } }
    : undefined;

  let total;
  let projects;

  try {
    [total, projects] = await Promise.all([
      Project.countDocuments(filter),
      Project.find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          'title shortDescription images technologies tags category githubUrl liveDemoUrl clerkId createdAt updatedAt'
        )
        .lean(),
    ]);
  } catch (error) {
    // If text index query fails (e.g. no text index yet), retry with regex.
    if (useTextScore) {
      delete filter.$text;
      filter.$or = [
        { title: { $regex: escapeRegex(q), $options: 'i' } },
        { shortDescription: { $regex: escapeRegex(q), $options: 'i' } },
        { tags: { $elemMatch: { $regex: escapeRegex(q), $options: 'i' } } },
        {
          technologies: {
            $elemMatch: { $regex: escapeRegex(q), $options: 'i' },
          },
        },
      ];
      sort = sortKey === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
      if (sortKey === 'title') sort = { title: 1 };
      [total, projects] = await Promise.all([
        Project.countDocuments(filter),
        Project.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select(
            'title shortDescription images technologies tags category githubUrl liveDemoUrl clerkId createdAt updatedAt'
          )
          .lean(),
      ]);
    } else {
      throw error;
    }
  }

  const ownerClerkIds = [...new Set(projects.map((project) => project.clerkId))];
  const profiles = await Profile.find({ clerkId: { $in: ownerClerkIds } })
    .select('clerkId fullName professionalTitle profileImage location')
    .lean();
  const profileByClerk = new Map(
    profiles.map((profile) => [profile.clerkId, profile])
  );

  const mapped = projects.map((project) => {
    const profile = profileByClerk.get(project.clerkId) || {};
    return toDiscoveryProject(project, {
      ...profile,
      username: usernameByClerk.get(project.clerkId) || null,
    });
  });

  res.status(200).json({
    success: true,
    data: {
      projects: mapped,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 0,
      },
      filters: {
        categories: Project.CATEGORIES,
        applied: {
          q: q || null,
          title: title || null,
          name: internName || null,
          category: category || null,
          technologies,
          skills,
          sort: sortKey,
        },
      },
    },
  });
});

/**
 * @desc    Get a single public project (must belong to a published portfolio)
 * @route   GET /api/explore/projects/:id
 * @access  Public
 */
const getPublicDiscoveryProject = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError('Project not found', 404);
  }

  const project = await Project.findById(req.params.id).lean();
  if (!project) throw new AppError('Project not found', 404);

  const settings = await PortfolioSettings.findOne({
    clerkId: project.clerkId,
    portfolioStatus: 'published',
    username: { $exists: true, $nin: [null, ''] },
  }).lean();

  if (!settings) throw new AppError('Project not found', 404);

  const profile = await Profile.findOne({ clerkId: project.clerkId }).lean();

  trackView({
    type: 'project',
    ownerClerkId: project.clerkId,
    targetKey: String(project._id),
    projectId: project._id,
    req,
  });

  res.status(200).json({
    success: true,
    data: {
      project: {
        ...toDiscoveryProject(project, {
          ...(profile || {}),
          username: settings.username,
        }),
        fullDescription: project.fullDescription,
        viewCount: project.viewCount || 0,
      },
    },
  });
});

/**
 * @desc    Search / filter / paginate published interns
 * @route   GET /api/explore/interns
 * @access  Public
 */
const searchInterns = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const q = String(req.query.q || req.query.search || '').trim();
  const name = String(req.query.name || '').trim();
  const skills = parseList(req.query.skill || req.query.skills);
  const technology = parseList(
    req.query.technology || req.query.technologies
  );
  const sortKey = String(req.query.sort || 'newest').toLowerCase();

  const published = await getPublishedPortfolios();
  if (!published.length) {
    return res.status(200).json({
      success: true,
      data: {
        interns: [],
        pagination: { page, limit, total: 0, pages: 0 },
      },
    });
  }

  const settingsByClerk = new Map(
    published.map((item) => [item.clerkId, item])
  );
  let clerkIds = published.map((item) => item.clerkId);

  // If filtering by project technology, narrow to owners who have matching projects
  if (technology.length) {
    const owners = await Project.distinct('clerkId', {
      clerkId: { $in: clerkIds },
      technologies: {
        $all: technology.map(
          (tech) => new RegExp(`^${escapeRegex(tech)}$`, 'i')
        ),
      },
    });
    clerkIds = owners;
    if (!clerkIds.length) {
      return res.status(200).json({
        success: true,
        data: {
          interns: [],
          pagination: { page, limit, total: 0, pages: 0 },
        },
      });
    }
  }

  const filter = { clerkId: { $in: clerkIds } };

  if (name) {
    filter.fullName = { $regex: escapeRegex(name), $options: 'i' };
  }

  if (skills.length) {
    filter.skills = {
      $all: skills.map((skill) => new RegExp(`^${escapeRegex(skill)}$`, 'i')),
    };
  }

  if (q) {
    filter.$or = [
      { fullName: { $regex: escapeRegex(q), $options: 'i' } },
      { professionalTitle: { $regex: escapeRegex(q), $options: 'i' } },
      { bio: { $regex: escapeRegex(q), $options: 'i' } },
      { skills: { $elemMatch: { $regex: escapeRegex(q), $options: 'i' } } },
      { location: { $regex: escapeRegex(q), $options: 'i' } },
      { university: { $regex: escapeRegex(q), $options: 'i' } },
    ];
  }

  let sort = { updatedAt: -1 };
  if (sortKey === 'oldest') sort = { createdAt: 1 };
  else if (sortKey === 'name') sort = { fullName: 1 };
  else if (sortKey === 'newest') sort = { createdAt: -1 };

  const [total, profiles] = await Promise.all([
    Profile.countDocuments(filter),
    Profile.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(
        'clerkId fullName professionalTitle profileImage bio location skills university'
      )
      .lean(),
  ]);

  const pageClerkIds = profiles.map((profile) => profile.clerkId);
  const projectCounts = await Project.aggregate([
    { $match: { clerkId: { $in: pageClerkIds } } },
    { $group: { _id: '$clerkId', count: { $sum: 1 } } },
  ]);
  const countByClerk = new Map(
    projectCounts.map((row) => [row._id, row.count])
  );

  const interns = profiles
    .map((profile) => {
      const settings = settingsByClerk.get(profile.clerkId);
      if (!settings) return null;
      return toDiscoveryIntern(profile, settings, {
        projectCount: countByClerk.get(profile.clerkId) || 0,
      });
    })
    .filter(Boolean);

  res.status(200).json({
    success: true,
    data: {
      interns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 0,
      },
      filters: {
        applied: {
          q: q || null,
          name: name || null,
          skills,
          technologies: technology,
          sort: sortKey,
        },
      },
    },
  });
});

/**
 * @desc    Lightweight filter metadata for explore UI
 * @route   GET /api/explore/meta
 * @access  Public
 */
const getExploreMeta = asyncHandler(async (req, res) => {
  const published = await getPublishedPortfolios();
  const clerkIds = published.map((item) => item.clerkId);

  const [techAgg, skillAgg, categoryAgg] = await Promise.all([
    Project.aggregate([
      { $match: { clerkId: { $in: clerkIds } } },
      { $unwind: '$technologies' },
      { $group: { _id: '$technologies', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 40 },
    ]),
    Profile.aggregate([
      { $match: { clerkId: { $in: clerkIds } } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 40 },
    ]),
    Project.aggregate([
      { $match: { clerkId: { $in: clerkIds } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      categories: Project.CATEGORIES,
      technologies: techAgg.map((row) => ({
        value: row._id,
        count: row.count,
      })),
      skills: skillAgg.map((row) => ({ value: row._id, count: row.count })),
      categoryCounts: categoryAgg.map((row) => ({
        value: row._id,
        count: row.count,
      })),
      publishedPortfolios: published.length,
    },
  });
});

module.exports = {
  searchProjects,
  getPublicDiscoveryProject,
  searchInterns,
  getExploreMeta,
};
