const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const PortfolioSettings = require('../models/PortfolioSettings');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');
const mongoose = require('mongoose');

const isValidObjectId = (value) =>
  Boolean(value) && mongoose.Types.ObjectId.isValid(value);

const normalizeHex = (value) => {
  if (value === undefined || value === null) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed) return '#1d6f52';
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    throw new AppError('Primary color must be a valid hex color', 400);
  }
  return trimmed;
};

const getOrCreateSettings = async (clerkId) => {
  let settings = await PortfolioSettings.findOne({ clerkId });
  if (settings) return settings;

  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new AppError('User not found. Sync auth first.', 404);
  }

  const projects = await Project.find({ clerkId }).select('_id').lean();

  settings = await PortfolioSettings.create({
    user: user._id,
    clerkId,
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

const buildEditorPayload = async (clerkId, settings) => {
  const [profile, projects, user] = await Promise.all([
    Profile.findOne({ clerkId }),
    Project.find({ clerkId }).sort({ createdAt: -1 }),
    User.findOne({ clerkId }).select('fullName email profileImage'),
  ]);

  const orderedProjects = orderProjects(projects, settings.projectOrder);

  // Keep projectOrder in sync with current projects (append new ones).
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

  if (portfolioStatus !== undefined) {
    if (!PortfolioSettings.STATUSES.includes(portfolioStatus)) {
      throw new AppError('Portfolio status must be draft or published', 400);
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
      settings.customization.skills.title = String(skills.title || '').trim() || 'Skills';
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
      settings.customization.projects.showTechnologies = projects.showTechnologies;
    }
  }

  if (customization.contact && typeof customization.contact === 'object') {
    const contact = customization.contact;
    if (contact.title !== undefined) {
      settings.customization.contact.title =
        String(contact.title || '').trim() || 'Get in touch';
    }
    if (contact.message !== undefined) {
      settings.customization.contact.message = String(contact.message || '').trim();
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
    // Append any owned projects missing from the payload so order stays complete.
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

module.exports = {
  getMyPortfolio,
  updateMyPortfolio,
  saveSectionVisibility,
  saveProjectOrder,
  saveTheme,
  saveCustomization,
};
