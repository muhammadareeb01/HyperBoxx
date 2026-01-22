const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// 1. Initialize the App IMMEDIATELY (Global Scope)
// This must happen before we try to use admin.firestore()
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin SDK Initialized");
} catch (error) {
  // Check if app is already initialized (prevents hot-reload errors)
  if (!/already exists/.test(error.message)) {
    console.error("Firebase Init Error:", error.stack);
  }
}

// 2. Now it is safe to export the database instance
const db = admin.firestore();

// 3. Keep this function so your server.js doesn't break, 
// but it doesn't need to do the heavy lifting anymore.
const connectDB = () => {
  console.log("Database connection ready.");
};

module.exports = { connectDB, db };