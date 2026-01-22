const admin = require('firebase-admin');

// 1. Verify if the user is Logged In
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Save the user info (uid, email) to the request for the next step
    req.user = decodedToken;
    
    next(); // Move to the next middleware (or controller)

  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

// 2. Verify if the user is an ADMIN (New!)
const verifyAdmin = async (req, res, next) => {
    try {
        // We need 'db' to check the database. 
        // Ensure admin.firestore() is accessible or import your db config
        const db = admin.firestore();

        // req.user was set by the previous 'verifyToken' function
        const { uid } = req.user;

        // Check their role in Firestore
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        const userData = userDoc.data();

        if (userData.role !== 'admin') {
            return res.status(403).json({ error: 'Access Denied: Admins only' });
        }

        next(); // They are an admin! Proceed.

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export BOTH functions
module.exports = { verifyToken, verifyAdmin };