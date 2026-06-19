const { db } = require('../config/db');
const admin = require('firebase-admin');

// @desc    Create a unique affiliate code
// @route   POST /api/affiliate/create-code
// @access  Private (Requires Auth Middleware)
const createAffiliateCode = async (req, res) => {
    try {
        const userId = req.user.uid; // Assuming authMiddleware attaches user to req
        let { code } = req.body;

        // 1. Validation
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ error: 'Invalid code format.' });
        }

        // Format code: Uppercase, trim, remove special chars to keep URLs clean
        code = code.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');

        if (code.length < 3 || code.length > 15) {
            return res.status(400).json({ error: 'Code must be between 3 and 15 characters.' });
        }

        // 2. The ACID Transaction
        await db.runTransaction(async (t) => {
            const userRef = db.collection('users').doc(userId);
            const codeRef = db.collection('affiliate_codes').doc(code); // Code IS the Doc ID

            // Read Operations must come first in Firestore transactions
            const userDoc = await t.get(userRef);
            const codeDoc = await t.get(codeRef);

            if (!userDoc.exists) throw new Error("User not found");
            if (userDoc.data().affiliateCode) {
                throw new Error("You already have an active affiliate code.");
            }
            if (codeDoc.exists) {
                throw new Error("This code is already taken. Please choose another.");
            }

            // Write Operations
            // A. Reserve the code in the global registry
            t.set(codeRef, {
                ownerUid: userId,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // B. Attach the code to the user profile
            t.update(userRef, { affiliateCode: code });
        });

        res.status(200).json({ success: true, message: 'Affiliate code created!', code });

    } catch (error) {
        console.error("Create Code Error:", error);
        // Distinguish between validation errors we threw, and actual server crashes
        const message = error.message || 'Server Error';
        res.status(400).json({ error: message });
    }
};

// @desc    Transfer Affiliate Balance to Main Balance
// @route   POST /api/affiliate/claim-balance
// @access  Private
const claimAffiliateBalance = async (req, res) => {
    try {
        const userId = req.user.uid;

        await db.runTransaction(async (t) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await t.get(userRef);

            if (!userDoc.exists) throw new Error("User not found");

            const currentAffiliateBalance = Number(userDoc.data().affiliateBalance) || 0;
            const currentMainBalance = Number(userDoc.data().balance) || 0;

            if (currentAffiliateBalance <= 0) {
                throw new Error("No affiliate balance to claim.");
            }

            // Write Operations
            // Move money and reset affiliate balance to 0
            t.update(userRef, {
                balance: currentMainBalance + currentAffiliateBalance,
                affiliateBalance: 0
            });

            // Audit Trail: Log this internal transfer
            const txRef = db.collection('all_transactions').doc();
            t.set(txRef, {
                type: 'AFFILIATE_CLAIM',
                amount: currentAffiliateBalance,
                userId: userId,
                email: userDoc.data().email,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                description: 'Claimed Affiliate Earnings',
                status: 'completed'
            });
        });

        res.status(200).json({ success: true, message: 'Balance claimed successfully.' });

    } catch (error) {
        console.error("Claim Balance Error:", error);
        res.status(400).json({ error: error.message || 'Server Error' });
    }
};


// @desc    Redeem a friend's affiliate code (Unlocks Free Boxes)
// @route   POST /api/affiliate/redeem-code
// @access  Private
const redeemAffiliateCode = async (req, res) => {
    try {
        const userId = req.user.uid;
        let { code } = req.body;

        if (!code) return res.status(400).json({ error: 'Please provide a code.' });
        code = code.toUpperCase().trim();

        await db.runTransaction(async (t) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await t.get(userRef);

            if (!userDoc.exists) throw new Error("User not found");
            
            // 1. Check if they already redeemed a code
            if (userDoc.data().referredBy) {
                throw new Error("You have already redeemed an affiliate code.");
            }

            // 2. Prevent entering their own code
            if (userDoc.data().affiliateCode === code) {
                throw new Error("You cannot use your own affiliate code.");
            }

            // 3. Verify the code exists in the global registry
            const codeRef = db.collection('affiliate_codes').doc(code);
            const codeDoc = await t.get(codeRef);

            if (!codeDoc.exists) {
                throw new Error("Invalid affiliate code.");
            }

            // 4. Update the user
            t.update(userRef, { referredBy: code });
        });

        res.status(200).json({ success: true, message: 'Code redeemed successfully! Free boxes unlocked.' });

    } catch (error) {
        res.status(400).json({ error: error.message || 'Server Error' });
    }
};

// Don't forget to export it!
module.exports = { createAffiliateCode, claimAffiliateBalance, redeemAffiliateCode };

// module.exports = { createAffiliateCode, claimAffiliateBalance };