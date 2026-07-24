const express = require('express');
const {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
} = require('../controllers/projectController');
const { requireAuth } = require('../middleware/auth');
const { uploadProjectImages: uploadMiddleware } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/security');

const router = express.Router();

router.use(requireAuth);

router.route('/').get(getMyProjects).post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.post('/:id/images', uploadLimiter, uploadMiddleware, uploadProjectImages);

module.exports = router;
