const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const PortfolioSettings = require('../models/PortfolioSettings');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');
const mongoose = require('mongoose');
const { verifyToken } = require('@clerk/express');
const config = require('../config');
const {
  slugifyUsername,
  validateUsernameFormat,
  normalizeUsername,
} = require('../utils/username');

const isValidObjectId = (value) =>
  Boolean(value) && mongoose.Types.ObjectId.isValid(value);

const tryResolveClerkId = async (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token || !config.clerkSecretKey) return null;
  try {
    const payload = await verifyToken(token, {
      secretKey: config.clerkSecretKey,
      clockSkewInMs: 60_000,
    });
    return payload?.sub || null;
  } catch {
    return null;
  }
};

const normalizeHex = (value) => {
  if (value === undefined || value === null) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed) return '#1d6f52';
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    throw new AppError('Primary color must be a valid hex color', 400);
  }
  return trimmed;
};

const isUsernameTaken = async (username, excludeClerkId = null) => {
  const query = { username };
  if (excludeClerkId) {
    query.clerkId = { $ne: excludeClerkId };
  }
  const existing = await PortfolioSettings.findOne(query).select('_id').lean();
  return Boolean(existing);
};

const generateUniqueUsername = async (seed, excludeClerkId = null) => {
  const base =
    slugifyUsername(seed) ||
    `intern-${Math.random().toString(36).slice(2, 8)}`;
  let candidate = base.length >= 3 ? base : `${base}port`;
  candidate = candidate.slice(0, 30);

  if (validateUsernameFormat(candidate)) {
    candidate = `intern-${Math.random().toString(36).slice(2, 8)}`;
  }

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const next =
      attempt === 0
        ? candidate
        : `${candidate.slice(0, 24)}-${attempt + 1}`.slice(0, 30);

    if (validateUsernameFormat(next)) continue;
    // eslint-disable-next-line no-await-in-loop
    const taken = await isUsernameTaken(next, excludeClerkId);
    if (!taken) return next;
  }

  return `intern-${Date.now().toString(36)}`.slice(0, 30);
};

const getOrCreateSettings = async (clerkId) => {
  let settings = await PortfolioSettings.findOne({ clerkId });
  if (settings) return settings;

  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new AppError('User not found. Sync auth first.', 404);
  }

  const projects = await Project.find({ clerkId }).select('_id').lean();
  const username = await generateUniqueUsername(user.fullName || user.email);

  settings = await PortfolioSettings.create({
    user: user._id,
    clerkId,
    username,
    projectOrder: projects.map((project) => project._id),
  });

  return settings;
};

const orderProjects = (projects, projectOrder = []) => {
  if (!projectOrder.length) return projects;

  const orderMap = new Map(
    projectOrder.map((id, index) => [String(id), index])
  );

  return [...projects].sort((a, b) => {
    const aIndex = orderMap.has(String(a._id))
      ? orderMap.get(String(a._id))
      : Number.MAX_SAFE_INTEGER;
    const bIndex = orderMap.has(String(b._id))
      ? orderMap.get(String(b._id))
      : Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

const toPublicProject = (
  project,
  { includeFull = false, showTechnologies = true } = {}
) => {
  if (!project) return null;
  const base = {
    id: project._id,
    title: project.title,
    shortDescription: project.shortDescription,
    images: project.images || [],
    category: project.category,
    tags: project.tags || [],
    githubUrl: project.githubUrl || '',
    liveDemoUrl: project.liveDemoUrl || '',
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };

  if (showTechnologies) {
    base.technologies = project.technologies || [];
  }

  if (includeFull) {
    base.fullDescription = project.fullDescription;
  }

  return base;
};

const toPublicIntern = (profile, user, settings) => {
  const custom = settings.customization || {};
  const contact = custom.contact || {};
  const about = custom.about || {};

  const intern = {
    fullName: profile?.fullName || user?.fullName || 'Intern',
    professionalTitle: profile?.professionalTitle || '',
    profileImage: profile?.profileImage || user?.profileImage || '',
    bio: about.intro || profile?.bio || '',
    skills: profile?.skills || [],
  };

  if (about.showLocation !== false && profile?.location) {
    intern.location = profile.location;
  }

  if (about.showEducation !== false) {
    if (profile?.university) intern.university = profile.university;
    if (profile?.degree) intern.degree = profile.degree;
    if (profile?.graduationYear) intern.graduationYear = profile.graduationYear;
  }

  if (contact.showGithub !== false && profile?.githubUrl) {
    intern.githubUrl = profile.githubUrl;
  }
  if (contact.showLinkedin !== false && profile?.linkedinUrl) {
    intern.linkedinUrl = profile.linkedinUrl;
  }
  if (profile?.portfolioUrl) {
    intern.externalPortfolioUrl = profile.portfolioUrl;
  }
  if (contact.showEmail !== false && user?.email) {
    intern.email = user.email;
  }

  return intern;
};

const toPublicSettings = (settings) => ({
  username: settings.username,
  theme: settings.theme,
  primaryColor: settings.primaryColor,
  customHeadline: settings.customHeadline,
  sectionVisibility: settings.sectionVisibility,
  customization: settings.customization,
  portfolioStatus: settings.portfolioStatus,
});

const findPublishedByUsername = async (rawUsername) => {
  const username = normalizeUsername(rawUsername);
  if (!username) {
    throw new AppError('Username is required', 400);
  }

  const settings = await PortfolioSettings.findOne({ username });
  if (!settings || settings.portfolioStatus !== 'published' || !settings.username) {
    throw new AppError('Portfolio not found', 404);
  }

  return settings;
};

const loadPublishedOwnerData = async (settings) => {
  const [profile, projects, user] = await Promise.all([
    Profile.findOne({ clerkId: settings.clerkId }),
    Project.find({ clerkId: settings.clerkId }).sort({ createdAt: -1 }),
    User.findOne({ clerkId: settings.clerkId }).select(
      'fullName email profileImage'
    ),
  ]);

  const ordered = orderProjects(projects, settings.projectOrder);
  return { profile, projects: ordered, user };
};

const buildEditorPayload = async (clerkId, settings) => {
  const [profile, projects, user] = await Promise.all([
    Profile.findOne({ clerkId }),
    Project.find({ clerkId }).sort({ createdAt: -1 }),
    User.findOne({ clerkId }).select('fullName email profileImage'),
  ]);

  const orderedProjects = orderProjects(projects, settings.projectOrder);

  const existingIds = new Set(settings.projectOrder.map(String));
  const missing = orderedProjects
    .map((project) => project._id)
    .filter((id) => !existingIds.has(String(id)));

  if (missing.length) {
    settings.projectOrder = [
      ...settings.projectOrder.filter((id) =>
        orderedProjects.some((project) => String(project._id) === String(id))
      ),
      ...missing,
    ];
    await settings.save();
  }

  if (!settings.username) {
    settings.username = await generateUniqueUsername(
      profile?.fullName || user?.fullName || user?.email || 'intern',
      clerkId
    );
    await settings.save();
  }

  return {
    settings,
    profile,
    projects: orderedProjects,
    user: user
      ? {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage,
        }
      : null,
    publicUrl: settings.username ? `/portfolio/${settings.username}` : null,
    themes: PortfolioSettings.THEMES,
    statuses: PortfolioSettings.STATUSES,
  };
};

/**
 * @desc    Get portfolio settings (with profile + ordered projects for editor)
 * @route   GET /api/portfolio/me
 * @access  Private
 */
const getMyPortfolio = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const data = await buildEditorPayload(req.clerkId, settings);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Update portfolio settings (full / partial save)
 * @route   PUT /api/portfolio/me
 * @access  Private
 */
const updateMyPortfolio = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const {
    theme,
    primaryColor,
    sectionVisibility,
    projectOrder,
    customHeadline,
    portfolioStatus,
    customization,
    username,
  } = req.body;

  if (theme !== undefined) {
    if (!PortfolioSettings.THEMES.includes(theme)) {
      throw new AppError('Invalid portfolio theme', 400);
    }
    settings.theme = theme;
  }

  if (primaryColor !== undefined) {
    settings.primaryColor = normalizeHex(primaryColor);
  }

  if (sectionVisibility && typeof sectionVisibility === 'object') {
    ['about', 'skills', 'projects', 'contact'].forEach((key) => {
      if (typeof sectionVisibility[key] === 'boolean') {
        settings.sectionVisibility[key] = sectionVisibility[key];
      }
    });
  }

  if (Array.isArray(projectOrder)) {
    const owned = await Project.find({ clerkId: req.clerkId }).select('_id');
    const ownedIds = new Set(owned.map((project) => String(project._id)));
    const cleaned = projectOrder
      .map(String)
      .filter((id) => isValidObjectId(id) && ownedIds.has(id));
    const unique = [...new Set(cleaned)];
    settings.projectOrder = unique;
  }

  if (customHeadline !== undefined) {
    settings.customHeadline = String(customHeadline || '').trim();
  }

  if (username !== undefined) {
    const next = normalizeUsername(username);
    const formatError = validateUsernameFormat(next);
    if (formatError) throw new AppError(formatError, 400);
    if (await isUsernameTaken(next, req.clerkId)) {
      throw new AppError('Username is already taken', 409);
    }
    settings.username = next;
  }

  if (portfolioStatus !== undefined) {
    if (!PortfolioSettings.STATUSES.includes(portfolioStatus)) {
      throw new AppError('Portfolio status must be draft or published', 400);
    }
    if (portfolioStatus === 'published' && !settings.username) {
      throw new AppError('Set a portfolio username before publishing', 400);
    }
    settings.portfolioStatus = portfolioStatus;
  }

  if (customization && typeof customization === 'object') {
    applyCustomization(settings, customization);
  }

  await settings.save();
  const data = await buildEditorPayload(req.clerkId, settings);

  res.status(200).json({
    success: true,
    message: 'Portfolio settings saved',
    data,
  });
});

const applyCustomization = (settings, customization) => {
  if (customization.about && typeof customization.about === 'object') {
    const about = customization.about;
    if (about.headline !== undefined) {
      settings.customization.about.headline = String(about.headline || '').trim();
    }
    if (about.intro !== undefined) {
      settings.customization.about.intro = String(about.intro || '').trim();
    }
    if (typeof about.showEducation === 'boolean') {
      settings.customization.about.showEducation = about.showEducation;
    }
    if (typeof about.showLocation === 'boolean') {
      settings.customization.about.showLocation = about.showLocation;
    }
  }

  if (customization.skills && typeof customization.skills === 'object') {
    const skills = customization.skills;
    if (skills.title !== undefined) {
      settings.customization.skills.title =
        String(skills.title || '').trim() || 'Skills';
    }
    if (skills.layout === 'chips' || skills.layout === 'list') {
      settings.customization.skills.layout = skills.layout;
    }
  }

  if (customization.projects && typeof customization.projects === 'object') {
    const projects = customization.projects;
    if (projects.title !== undefined) {
      settings.customization.projects.title =
        String(projects.title || '').trim() || 'Projects';
    }
    if (typeof projects.showTechnologies === 'boolean') {
      settings.customization.projects.showTechnologies =
        projects.showTechnologies;
    }
  }

  if (customization.contact && typeof customization.contact === 'object') {
    const contact = customization.contact;
    if (contact.title !== undefined) {
      settings.customization.contact.title =
        String(contact.title || '').trim() || 'Get in touch';
    }
    if (contact.message !== undefined) {
      settings.customization.contact.message = String(
        contact.message || ''
      ).trim();
    }
    if (typeof contact.showEmail === 'boolean') {
      settings.customization.contact.showEmail = contact.showEmail;
    }
    if (typeof contact.showGithub === 'boolean') {
      settings.customization.contact.showGithub = contact.showGithub;
    }
    if (typeof contact.showLinkedin === 'boolean') {
      settings.customization.contact.showLinkedin = contact.showLinkedin;
    }
  }
};

/**
 * @desc    Save section visibility
 * @route   PUT /api/portfolio/me/visibility
 * @access  Private
 */
const saveSectionVisibility = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const { sectionVisibility } = req.body;

  if (!sectionVisibility || typeof sectionVisibility !== 'object') {
    throw new AppError('sectionVisibility object is required', 400);
  }

  ['about', 'skills', 'projects', 'contact'].forEach((key) => {
    if (typeof sectionVisibility[key] === 'boolean') {
      settings.sectionVisibility[key] = sectionVisibility[key];
    }
  });

  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Section visibility saved',
    data: { settings },
  });
});

/**
 * @desc    Save project order
 * @route   PUT /api/portfolio/me/project-order
 * @access  Private
 */
const saveProjectOrder = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const { projectOrder } = req.body;

  if (!Array.isArray(projectOrder)) {
    throw new AppError('projectOrder must be an array of project ids', 400);
  }

  const owned = await Project.find({ clerkId: req.clerkId }).select('_id');
  const ownedIds = new Set(owned.map((project) => String(project._id)));
  const cleaned = projectOrder
    .map(String)
    .filter((id) => isValidObjectId(id) && ownedIds.has(id));
  const unique = [...new Set(cleaned)];

  if (unique.length !== ownedIds.size) {
    owned.forEach((project) => {
      const id = String(project._id);
      if (!unique.includes(id)) unique.push(id);
    });
  }

  settings.projectOrder = unique;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Project order saved',
    data: { settings },
  });
});

/**
 * @desc    Save selected theme (+ optional primary color)
 * @route   PUT /api/portfolio/me/theme
 * @access  Private
 */
const saveTheme = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const { theme, primaryColor } = req.body;

  if (!theme || !PortfolioSettings.THEMES.includes(theme)) {
    throw new AppError(
      `Theme must be one of: ${PortfolioSettings.THEMES.join(', ')}`,
      400
    );
  }

  settings.theme = theme;
  if (primaryColor !== undefined) {
    settings.primaryColor = normalizeHex(primaryColor);
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Theme saved',
    data: { settings },
  });
});

/**
 * @desc    Save customization settings (about / skills / projects / contact)
 * @route   PUT /api/portfolio/me/customization
 * @access  Private
 */
const saveCustomization = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const { customization, customHeadline } = req.body;

  if (!customization || typeof customization !== 'object') {
    throw new AppError('customization object is required', 400);
  }

  applyCustomization(settings, customization);

  if (customHeadline !== undefined) {
    settings.customHeadline = String(customHeadline || '').trim();
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Customization settings saved',
    data: { settings },
  });
});

/**
 * @desc    Check username availability
 * @route   GET /api/portfolio/check-username?username=
 * @access  Public
 */
const checkUsernameAvailability = asyncHandler(async (req, res) => {
  const username = normalizeUsername(req.query.username);
  const formatError = validateUsernameFormat(username);

  if (formatError) {
    return res.status(200).json({
      success: true,
      data: {
        username,
        available: false,
        reason: formatError,
      },
    });
  }

  const excludeClerkId = req.clerkId || (await tryResolveClerkId(req));
  const taken = await isUsernameTaken(username, excludeClerkId);

  res.status(200).json({
    success: true,
    data: {
      username,
      available: !taken,
      reason: taken ? 'Username is already taken' : null,
    },
  });
});

/**
 * @desc    Generate a unique username suggestion for the current user
 * @route   POST /api/portfolio/me/username/generate
 * @access  Private
 */
const generateMyUsername = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const user = await User.findOne({ clerkId: req.clerkId });
  const profile = await Profile.findOne({ clerkId: req.clerkId });
  const seed =
    req.body?.seed ||
    profile?.fullName ||
    user?.fullName ||
    user?.email ||
    'intern';

  const username = await generateUniqueUsername(seed, req.clerkId);

  res.status(200).json({
    success: true,
    data: {
      username,
      currentUsername: settings.username || null,
    },
  });
});

/**
 * @desc    Set / update portfolio username (slug)
 * @route   PUT /api/portfolio/me/username
 * @access  Private
 */
const setMyUsername = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings(req.clerkId);
  const username = normalizeUsername(req.body.username);
  const formatError = validateUsernameFormat(username);
  if (formatError) throw new AppError(formatError, 400);

  if (await isUsernameTaken(username, req.clerkId)) {
    throw new AppError('Username is already taken', 409);
  }

  settings.username = username;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Username saved',
    data: {
      settings,
      publicUrl: `/portfolio/${settings.username}`,
    },
  });
});

/**
 * @desc    Get public portfolio by username
 * @route   GET /api/portfolio/public/:username
 * @access  Public
 */
const getPublicPortfolio = asyncHandler(async (req, res) => {
  const settings = await findPublishedByUsername(req.params.username);
  const { profile, projects, user } = await loadPublishedOwnerData(settings);
  const showTechnologies =
    settings.customization?.projects?.showTechnologies !== false;

  const publicProjects =
    settings.sectionVisibility?.projects === false
      ? []
      : projects.map((project) =>
          toPublicProject(project, { showTechnologies })
        );

  res.status(200).json({
    success: true,
    data: {
      settings: toPublicSettings(settings),
      intern: toPublicIntern(profile, user, settings),
      projects: publicProjects,
    },
  });
});

/**
 * @desc    Get public intern information
 * @route   GET /api/portfolio/public/:username/profile
 * @access  Public
 */
const getPublicIntern = asyncHandler(async (req, res) => {
  const settings = await findPublishedByUsername(req.params.username);
  const { profile, user } = await loadPublishedOwnerData(settings);

  res.status(200).json({
    success: true,
    data: {
      username: settings.username,
      intern: toPublicIntern(profile, user, settings),
      settings: {
        customHeadline: settings.customHeadline,
        theme: settings.theme,
        primaryColor: settings.primaryColor,
        sectionVisibility: settings.sectionVisibility,
      },
    },
  });
});

/**
 * @desc    Get public projects for a portfolio
 * @route   GET /api/portfolio/public/:username/projects
 * @access  Public
 */
const getPublicProjects = asyncHandler(async (req, res) => {
  const settings = await findPublishedByUsername(req.params.username);
  const { projects } = await loadPublishedOwnerData(settings);
  const showTechnologies =
    settings.customization?.projects?.showTechnologies !== false;

  if (settings.sectionVisibility?.projects === false) {
    return res.status(200).json({
      success: true,
      data: { projects: [], count: 0 },
    });
  }

  const publicProjects = projects.map((project) =>
    toPublicProject(project, { showTechnologies })
  );

  res.status(200).json({
    success: true,
    data: {
      projects: publicProjects,
      count: publicProjects.length,
    },
  });
});

/**
 * @desc    Get a single public project
 * @route   GET /api/portfolio/public/:username/projects/:projectId
 * @access  Public
 */
const getPublicProject = asyncHandler(async (req, res) => {
  const settings = await findPublishedByUsername(req.params.username);

  if (settings.sectionVisibility?.projects === false) {
    throw new AppError('Project not found', 404);
  }

  if (!isValidObjectId(req.params.projectId)) {
    throw new AppError('Project not found', 404);
  }

  const project = await Project.findOne({
    _id: req.params.projectId,
    clerkId: settings.clerkId,
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const showTechnologies =
    settings.customization?.projects?.showTechnologies !== false;

  res.status(200).json({
    success: true,
    data: {
      project: toPublicProject(project, {
        includeFull: true,
        showTechnologies,
      }),
    },
  });
});

module.exports = {
  getMyPortfolio,
  updateMyPortfolio,
  saveSectionVisibility,
  saveProjectOrder,
  saveTheme,
  saveCustomization,
  checkUsernameAvailability,
  generateMyUsername,
  setMyUsername,
  getPublicPortfolio,
  getPublicIntern,
  getPublicProjects,
  getPublicProject,
};
