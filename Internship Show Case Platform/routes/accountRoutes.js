const express = require('express');
const {
  getAccount,
  updateAccount,
  updatePassword,
  deleteAccount,
} = require('../controllers/accountController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', getAccount);
router.put('/', updateAccount);
router.put('/password', updatePassword);
router.delete('/', deleteAccount);

module.exports = router;
