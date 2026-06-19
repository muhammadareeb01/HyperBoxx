const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile } = require('../controllers/userController');
const {verifyToken, verifyAdmin} = require('../middleware/authMiddleware');
const admin = require('firebase-admin');

// GET ALL USERS (Protected)
// This lets the Admin see a list of everyone registered
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const usersRef = admin.firestore().collection('users');
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        let users = [];
        snapshot.forEach(doc => {
            // We usually don't send back sensitive data, just the basics
            const userData = doc.data();
            users.push({
                id: doc.id,
                email: userData.email,
                role: userData.role || 'user', // Default to 'user' if undefined
                createdAt: userData.createdAt
            });
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE USER (Archive + Delete)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const uid = req.params.id;
        const { reason } = req.body; // We expect a reason now!

        const db = admin.firestore();
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        const userData = userDoc.data();

        // 1. Save to 'deleted_users' collection (Archive)
        await db.collection('deleted_users').doc(uid).set({
            ...userData, // Copy all old data (balance, email, etc.)
            deletedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleteReason: reason || "No reason provided",
            deletedByAdmin: req.user.email // Log which admin did it
        });

        // 2. Delete from Firestore 'users'
        await userRef.delete();

        // 3. Delete from Firebase Authentication (Login access)
        await admin.auth().deleteUser(uid);

        res.status(200).json({ message: 'User archived and deleted successfully' });

    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Update User Balance (Add/Remove Credit)
router.put('/:id/balance', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body; // Expecting a number (positive to add, negative to remove)

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const db = admin.firestore();
        const userRef = db.collection('users').doc(id);
        
        await db.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);
            if (!userDoc.exists) throw new Error("User not found");

            const currentBalance = Number(userDoc.data().balance) || 0;
            const newBalance = currentBalance + Number(amount);

            // 1. Update Balance
            t.update(userRef, { balance: newBalance });

            // 2. Log this Admin Action (Important for security!)
            const logRef = db.collection('all_transactions').doc();
            t.set(logRef, {
                uid: id,
                email: userDoc.data().email,
                type: 'ADMIN_ADJUSTMENT',
                amount: Number(amount),
                description: `Admin manual adjustment`,
                balanceAfter: newBalance,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        res.status(200).json({ message: "Balance updated successfully" });

    } catch (error) {
        console.error("Balance Update Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Define the route
router.post('/register', registerUser);
router.get('/profile', verifyToken, getUserProfile);


module.exports = router;