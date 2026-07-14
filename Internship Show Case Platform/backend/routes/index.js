const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

/**
 * Central API router.
 * Mount feature routers here as modules are added.
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

module.exports = router;
