const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const projectRoutes = require('./projectRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const discoverRoutes = require('./discoverRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const accountRoutes = require('./accountRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/explore', discoverRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/account', accountRoutes);

module.exports = router;
