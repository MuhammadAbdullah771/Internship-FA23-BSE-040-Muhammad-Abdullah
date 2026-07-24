const fs = require('fs');
const path = require('path');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const Project = require('../models/Project');
const User = require('../models/User');

const normalizeList = (value, { maxItems, maxLen }) => {
  let items = [];

  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === 'string') {
    items = value.split(/[,|\n]/);
  }

  const cleaned = [
    ...new Set(
      items
        .map((item) => String(item || '').trim().replace(/\s+/g, ' '))
        .filter(Boolean)
        .map((item) => item.slice(0, maxLen))
    ),
  ];

  return cleaned.slice(0, maxItems);
};

const optionalUrl = (value) => {
  if (value === undefined || value === null) return '';
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  try {
    // eslint-disable-next-line no-new
    new URL(trimmed);
    return trimmed;
  } catch {
    throw new AppError('Please provide a valid URL', 400);
  }
};

const removeLocalImages = (images = []) => {
  images.forEach((imagePath) => {
    if (!imagePath || imagePath.startsWith('http')) return;
    const absolute = path.join(
      __dirname,
      '..',
      imagePath.replace(/^\//, '').replace(/\//g, path.sep)
    );
    if (fs.existsSync(absolute)) {
      fs.unlinkSync(absolute);
    }
  });
};

const getOwnedProject = async (projectId, clerkId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  if (project.clerkId !== clerkId) {
    throw new AppError('You can only manage your own projects', 403);
  }
  return project;
};

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = asyncHandler(async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) {
    throw new AppError('User not found. Sync auth first.', 404);
  }

  const {
    title,
    shortDescription,
    fullDescription,
    technologies,
    tags,
    githubUrl,
    liveDemoUrl,
    category,
  } = req.body;

  if (!title?.trim() || !shortDescription?.trim() || !fullDescription?.trim()) {
    throw new AppError(
      'Title, short description, and full description are required',
      400
    );
  }

  const images = [];

  const project = await Project.create({
    user: user._id,
    clerkId: req.clerkId,
    title: title.trim(),
    shortDescription: shortDescription.trim(),
    fullDescription: fullDescription.trim(),
    images,
    technologies: normalizeList(technologies, { maxItems: 25, maxLen: 40 }),
    tags: normalizeList(tags, { maxItems: 20, maxLen: 30 }),
    githubUrl: optionalUrl(githubUrl),
    liveDemoUrl: optionalUrl(liveDemoUrl),
    category: category || 'web',
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: { project },
  });
});

/**
 * @desc    Get all projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ clerkId: req.clerkId }).sort({
    updatedAt: -1,
  });

  res.status(200).json({
    success: true,
    data: {
      projects,
      count: projects.length,
    },
  });
});

/**
 * @desc    Get single project owned by current user
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProject = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.params.id, req.clerkId);

  res.status(200).json({
    success: true,
    data: { project },
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.params.id, req.clerkId);

  const {
    title,
    shortDescription,
    fullDescription,
    technologies,
    tags,
    githubUrl,
    liveDemoUrl,
    category,
    removeImages,
  } = req.body;

  if (title !== undefined) {
    if (!String(title).trim()) {
      throw new AppError('Title cannot be empty', 400);
    }
    project.title = String(title).trim();
  }

  if (shortDescription !== undefined) {
    if (!String(shortDescription).trim()) {
      throw new AppError('Short description cannot be empty', 400);
    }
    project.shortDescription = String(shortDescription).trim();
  }

  if (fullDescription !== undefined) {
    if (!String(fullDescription).trim()) {
      throw new AppError('Full description cannot be empty', 400);
    }
    project.fullDescription = String(fullDescription).trim();
  }

  if (technologies !== undefined) {
    project.technologies = normalizeList(technologies, {
      maxItems: 25,
      maxLen: 40,
    });
  }

  if (tags !== undefined) {
    project.tags = normalizeList(tags, { maxItems: 20, maxLen: 30 });
  }

  if (githubUrl !== undefined) {
    project.githubUrl = optionalUrl(githubUrl);
  }

  if (liveDemoUrl !== undefined) {
    project.liveDemoUrl = optionalUrl(liveDemoUrl);
  }

  if (category !== undefined) {
    project.category = category || 'web';
  }

  let imagesToRemove = [];
  if (removeImages !== undefined) {
    if (Array.isArray(removeImages)) {
      imagesToRemove = removeImages;
    } else if (typeof removeImages === 'string') {
      try {
        const parsed = JSON.parse(removeImages);
        imagesToRemove = Array.isArray(parsed) ? parsed : [removeImages];
      } catch {
        imagesToRemove = removeImages.split(',').map((item) => item.trim());
      }
    }
  }

  if (imagesToRemove.length) {
    const remaining = project.images.filter(
      (image) => !imagesToRemove.includes(image)
    );
    const deleted = project.images.filter((image) =>
      imagesToRemove.includes(image)
    );
    removeLocalImages(deleted);
    project.images = remaining;
  }

  await project.save();

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: { project },
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.params.id, req.clerkId);
  removeLocalImages(project.images);
  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: { id: req.params.id },
  });
});

/**
 * @desc    Upload additional project images
 * @route   POST /api/projects/:id/images
 * @access  Private
 */
const uploadProjectImages = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.params.id, req.clerkId);
  const files = req.files || [];

  if (!files.length) {
    throw new AppError('Please select at least one image to upload', 400);
  }

  if (project.images.length + files.length > 8) {
    removeLocalImages(
      files.map((file) => `/uploads/projects/${file.filename}`)
    );
    throw new AppError('A project can have at most 8 images', 400);
  }

  const uploaded = files.map((file) => `/uploads/projects/${file.filename}`);
  project.images.push(...uploaded);
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: { project },
  });
});

module.exports = {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
};
