const express = require('express');
const {
  getMyPortfolio,
  updateMyPortfolio,
  saveSectionVisibility,
  saveProjectOrder,
  saveTheme,
  saveCustomization,
} = require('../controllers/portfolioController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/me', getMyPortfolio);
router.put('/me', updateMyPortfolio);
router.put('/me/visibility', saveSectionVisibility);
router.put('/me/project-order', saveProjectOrder);
router.put('/me/theme', saveTheme);
router.put('/me/customization', saveCustomization);

module.exports = router;
