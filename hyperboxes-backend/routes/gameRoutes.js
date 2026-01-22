const express = require('express');
const router = express.Router();
const { openBox, sellItem, shipItem } = require('../controllers/gameController');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. Open Box
router.post('/boxes/:id/open', verifyToken, openBox);

// 2. Sell Item (Inventory Action)
router.post('/inventory/:itemId/sell', verifyToken, sellItem);

// 3. Ship Item (Inventory Action)
router.post('/inventory/:itemId/ship', verifyToken, shipItem);

module.exports = router;