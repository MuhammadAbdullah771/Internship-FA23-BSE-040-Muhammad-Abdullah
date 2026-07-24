const express = require('express');
const {
  getDashboardStats,
  getDashboardAnalytics,
} = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/stats', getDashboardStats);
router.get('/analytics', getDashboardAnalytics);

module.exports = router;
