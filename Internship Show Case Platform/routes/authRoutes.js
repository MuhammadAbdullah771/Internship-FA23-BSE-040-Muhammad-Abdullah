const express = require('express');
const { syncUser, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

router.use(authLimiter);
router.post('/sync', requireAuth, syncUser);
router.get('/me', requireAuth, getMe);

module.exports = router;
