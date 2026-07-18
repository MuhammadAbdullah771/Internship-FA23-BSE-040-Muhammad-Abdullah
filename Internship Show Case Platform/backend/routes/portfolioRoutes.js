const express = require('express');
const {
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
} = require('../controllers/portfolioController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public — no authentication
router.get('/check-username', checkUsernameAvailability);
router.get('/public/:username', getPublicPortfolio);
router.get('/public/:username/profile', getPublicIntern);
router.get('/public/:username/projects', getPublicProjects);
router.get('/public/:username/projects/:projectId', getPublicProject);

// Private — portfolio editor & ownership
router.use(requireAuth);

router.get('/me', getMyPortfolio);
router.put('/me', updateMyPortfolio);
router.put('/me/visibility', saveSectionVisibility);
router.put('/me/project-order', saveProjectOrder);
router.put('/me/theme', saveTheme);
router.put('/me/customization', saveCustomization);
router.put('/me/username', setMyUsername);
router.post('/me/username/generate', generateMyUsername);

module.exports = router;
