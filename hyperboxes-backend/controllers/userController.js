const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, uid } = req.body;

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

module.exports = { registerUser };