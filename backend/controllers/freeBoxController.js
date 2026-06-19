const { db } = require('../config/db');
const admin = require('firebase-admin');

// Configuration for the 8 levels
const FREE_BOX_TIERS = {
    1: { requiredLifetime: 10, rewardValue: 1.00 }, // Example rewards: $1.00 credit
    2: { requiredLifetime: 25, rewardValue: 2.50 },
    3: { requiredLifetime: 100, rewardValue: 5.00 },
    4: { requiredLifetime: 250, rewardValue: 10.00 },
    5: { requiredLifetime: 1000, rewardValue: 25.00 },
    6: { requiredLifetime: 2500, rewardValue: 50.00 },
    7: { requiredLifetime: 5000, rewardValue: 100.00 },
    8: { requiredLifetime: 10000, rewardValue: 250.00 }
};

// @desc    Open a daily free box
// @route   POST /api/free-boxes/open
// @access  Private
const openFreeBox = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { boxLevel } = req.body; // Expects 1, 2, 3... 8

        // 1. Validation
        if (!boxLevel || !FREE_BOX_TIERS[boxLevel]) {
            return res.status(400).json({ error: 'Invalid box level.' });
        }

        const tierConfig = FREE_BOX_TIERS[boxLevel];

        await db.runTransaction(async (t) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await t.get(userRef);
            if (!userDoc.exists) throw new Error("User not found");
            const userData = userDoc.data();

            // 2. The Gatekeeper Check (Must have redeemed a code)
            if (!userData.referredBy) {
                throw new Error("You must redeem an affiliate code to unlock Free Boxes.");
            }

            // 3. The Progression Check
            const lifetimeBoxes = userData.lifetimeBoxesOpened || 0;
            if (lifetimeBoxes < tierConfig.requiredLifetime) {
                throw new Error(`You need to open ${tierConfig.requiredLifetime} total boxes to unlock Level ${boxLevel}.`);
            }

            // 4. The 24-Hour Cooldown Check
            const lastClaims = userData.lastFreeBoxClaims || {};
            const lastClaimTime = lastClaims[`box_${boxLevel}`];
            
            if (lastClaimTime) {
                const now = new Date();
                const lastTime = lastClaimTime.toDate(); // Convert Firestore Timestamp
                const hoursSinceLastClaim = Math.abs(now - lastTime) / 36e5;

                if (hoursSinceLastClaim < 24) {
                    const hoursLeft = (24 - hoursSinceLastClaim).toFixed(1);
                    throw new Error(`Box is cooling down. Please wait ${hoursLeft} hours.`);
                }
            }

            // 5. Grant Reward & Reset Timer
            // Note: Currently adding raw balance for testing. You can change this to give a physical item to their inventory later.
            const newBalance = (Number(userData.balance) || 0) + tierConfig.rewardValue;
            
            // Create the updated timestamps map
            const updatedClaims = { ...lastClaims };
            updatedClaims[`box_${boxLevel}`] = admin.firestore.FieldValue.serverTimestamp();

            t.update(userRef, { 
                balance: newBalance,
                lastFreeBoxClaims: updatedClaims
            });

            // 6. Audit Log
            const txRef = db.collection('all_transactions').doc();
            t.set(txRef, {
                type: 'FREE_BOX_REWARD',
                amount: tierConfig.rewardValue,
                userId: userId,
                description: `Claimed Daily Free Box Level ${boxLevel}`,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                status: 'completed'
            });
        });

        res.status(200).json({ 
            success: true, 
            message: `Level ${boxLevel} Free Box opened! You won $${tierConfig.rewardValue}!` 
        });

    } catch (error) {
        res.status(400).json({ error: error.message || 'Server Error' });
    }
};

module.exports = { openFreeBox };