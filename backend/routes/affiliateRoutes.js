const express = require('express');
const router = express.Router();
const { createAffiliateCode, claimAffiliateBalance, redeemAffiliateCode } = require('../controllers/affiliateController');
const { verifyToken } = require('../middleware/authMiddleware'); // Your existing auth middleware

router.post('/create-code', verifyToken, createAffiliateCode);
// router.post('/create-code', createAffiliateCode);
router.post('/claim-balance', verifyToken, claimAffiliateBalance);
// router.post('/claim-balance', claimAffiliateBalance);

router.post('/redeem-code', verifyToken, redeemAffiliateCode);

module.exports = router;