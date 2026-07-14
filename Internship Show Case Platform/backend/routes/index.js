const express = require('express');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

/**
 * Central API router.
 * Mount feature routers here as modules are added:
 *   /api/auth, /api/profiles, /api/projects, /api/portfolios
 */
router.use('/health', healthRoutes);

module.exports = router;
