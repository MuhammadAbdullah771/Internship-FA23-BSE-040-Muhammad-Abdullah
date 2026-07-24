const express = require('express');
const {
  getMyProfile,
  createProfile,
  updateProfile,
  uploadProfileImage,
  addSkill,
  removeSkill,
  updateSocialLinks,
} = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');
const { uploadProfileImage: uploadMiddleware } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/security');

const router = express.Router();

router.use(requireAuth);

router.get('/me', getMyProfile);
router.post('/', createProfile);
router.put('/me', updateProfile);
router.post('/me/image', uploadLimiter, uploadMiddleware, uploadProfileImage);
router.post('/me/skills', addSkill);
router.delete('/me/skills/:skill', removeSkill);
router.put('/me/social', updateSocialLinks);

module.exports = router;
