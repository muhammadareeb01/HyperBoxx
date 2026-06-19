const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Added 'referredBy' to capture an affiliate code if they use one during signup
    const { username, email, password, uid, referredBy } = req.body;

    // 1. Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please include all fields' });
    }

    // 2. Check if user already exists
    const userRef = db.collection('users');
    const snapshot = await userRef.where('email', '==', email).get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 3. Hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Generate Provably Fair Data [Requirements: 16, 17, 18]
    const serverSeed = uuidv4(); // Secret seed
    const clientSeed = uuidv4(); // User's seed
    // We hash the server seed to show the user later (Transparency)
    const hashedServerSeed = crypto.createHash('sha256').update(serverSeed).digest('hex');

    // 5. Prepare User Object
    const newUser = {
      username,
      email,
      password: hashedPassword,
      balance: 0,           // Starts with $0
      role: 'user',         // Default role
      provablyFair: {
        serverSeed,         // ACTIVE (Hidden)
        clientSeed,         // ACTIVE
        nonce: 0,           // Starts at 0
        hashedServerSeed    // PUBLIC (Proof)
      },
      
      // ==========================================
      // NEW SCHEMA: Affiliate & Free Box Tracking
      // ==========================================
      affiliateCode: null,              // Stored as null until they create one on the Affiliates Page
      referredBy: referredBy || null,   // The code of the friend who referred them (if provided)
      affiliateBalance: 0,              // Unclaimed commission from referrals (Starts at $0)
      lifetimeBoxesOpened: 0,           // Counter for the 8-box unlock requirements
      lastFreeBoxClaims: {},            // Map to track 24-hour cooldowns (e.g., { "box_1": "Timestamp" })
      // ==========================================

      createdAt: new Date().toISOString(),
      uid: uid
    };

    // 6. Save to Firebase
    const resDb = await db.collection('users').doc(uid).set(newUser);

    // 7. Send Response
    res.status(201).json({
      success: true,
      id: uid,
      username: newUser.username,
      balance: newUser.balance,
      // We do NOT send the raw serverSeed, only the hash!
      provablyFair: {
        hashedServerSeed: newUser.provablyFair.hashedServerSeed,
        clientSeed: newUser.provablyFair.clientSeed,
        nonce: newUser.provablyFair.nonce
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Get user profile data (for Affiliate Dashboard)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, user: userDoc.data() });
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { registerUser, getUserProfile };