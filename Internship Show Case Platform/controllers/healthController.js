const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Health check — verifies API and DB connectivity
 * @route   GET /api/health
 * @access  Public
 */
const getHealth = asyncHandler(async (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    message: 'Intern Showcase API is running',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: states[dbState] || 'unknown',
    },
  });
});

module.exports = {
  getHealth,
};
