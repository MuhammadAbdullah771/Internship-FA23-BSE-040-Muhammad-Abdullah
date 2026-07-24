const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AppError = require('../utils/AppError');

const profilesRoot = path.join(__dirname, '..', 'uploads', 'profiles');
const projectsRoot = path.join(__dirname, '..', 'uploads', 'projects');

[profilesRoot, projectsRoot].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const imageFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(
      new AppError('Only JPEG, PNG, WebP, or GIF images are allowed', 400),
      false
    );
  }
  return cb(null, true);
};

const safeImageExt = (originalname) => {
  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
};

const profileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, profilesRoot);
  },
  filename(req, file, cb) {
    cb(null, `${req.clerkId}-${Date.now()}${safeImageExt(file.originalname)}`);
  },
});

const projectStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, projectsRoot);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${req.clerkId}-${Date.now()}-${Math.round(Math.random() * 1e6)}${safeImageExt(file.originalname)}`
    );
  },
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const projectUpload = multer({
  storage: projectStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  uploadProfileImage: profileUpload.single('profileImage'),
  uploadProjectImages: projectUpload.array('images', 8),
  profilesRoot,
  projectsRoot,
};
