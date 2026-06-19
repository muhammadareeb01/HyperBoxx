const express = require('express');
const router = express.Router();
const { openFreeBox } = require('../controllers/freeBoxController');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/free-boxes/open
// @desc    Open a daily free box (Requires boxLevel in body)
// @access  Private
router.post('/open', verifyToken, openFreeBox);

module.exports = router;