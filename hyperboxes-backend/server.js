require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const path = require("path");
const admin = require("firebase-admin");
const fs = require("fs");
const multer = require("multer"); // Import multer here
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const db = admin.firestore();

// 1. Initialize Express
const app = express();

// --- MULTER SETUP (Must be before your routes) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this folder matches where you manually created 'uploads'
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Unique filename: "image-" + timestamp + ".jpg"
    cb(null, "image-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 2. Middleware
// app.use(express.json());
// app.use(cors());
app.use(cors({ origin: true }));
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// 3. Connect to Firebase
connectDB();

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/boxes", require("./routes/boxRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/game", require("./routes/gameRoutes"));

// --- MAKE UPLOADS FOLDER STATIC ---
// This lets you access images at http://localhost:5000/uploads/image.jpg
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 1. GET ALL BOXES
app.get("/api/boxes", async (req, res) => {
  try {
    const boxesRef = db.collection("boxes");
    const snapshot = await boxesRef.get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    let boxes = [];
    snapshot.forEach((doc) => {
      boxes.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(boxes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET SINGLE BOX BY ID
app.get("/api/boxes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Check if ID is valid or exists
    const doc = await db.collection("boxes").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Box not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. DELETE BOX AND IMAGE
app.delete("/api/boxes/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const boxRef = db.collection("boxes").doc(id);

    // 1. Get the box data first (so we know which image to delete)
    const doc = await boxRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Box not found" });
    }

    const boxData = doc.data();

    // 2. Delete the Image File from local storage
    // Assuming your imageUrl is saved like: "http://localhost:5000/uploads/image-123.jpg"
    // We need to extract just the filename "image-123.jpg"

    if (boxData.image) {
      // Split the URL by '/' and get the last part (the filename)
      const filename = boxData.image.split("/").pop();
      const filePath = path.join(__dirname, "uploads", filename);

      // Check if file exists, then delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // This deletes the file
        console.log(`Deleted file: ${filename}`);
      }
    }

    // 3. Delete the document from Firestore
    await boxRef.delete();

    res.status(200).json({ message: "Box and image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE BOX (Handles Text AND/OR New Image)
// 4. UPDATE BOX (Safer Version)
app.put(
  "/api/boxes/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const boxRef = db.collection("boxes").doc(id);
      const doc = await boxRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Box not found" });
      }

      const oldData = doc.data();

      // --- DYNAMIC UPDATE OBJECT ---
      // We only add fields to this object if they exist in the request
      const updates = {};

      if (req.body.name) updates.name = req.body.name;
      if (req.body.price) updates.price = req.body.price;
      // Add other text fields here similarly...

      // --- HANDLE IMAGE UPDATE ---
      if (req.file) {
        // 1. Delete the OLD image file if it exists
        if (oldData.image) {
          // assuming field name is 'image'
          const oldFilename = oldData.image.split("/").pop();
          const oldFilePath = path.join(process.cwd(), "uploads", oldFilename);

          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`Deleted old image: ${oldFilename}`);
          }
        }

        // 2. Add NEW image URL to the updates
        const port = process.env.PORT || 5000;
        updates.image = `http://localhost:${port}/uploads/${req.file.filename}`;
      }

      // --- FINAL CHECK ---
      // If 'updates' is empty (user sent nothing), return early
      if (Object.keys(updates).length === 0) {
        return res
          .status(400)
          .json({ message: "No fields provided for update" });
      }

      // Update Firestore with ONLY the changed fields
      await boxRef.update(updates);

      res.status(200).json({
        message: "Box updated successfully",
        updatedFields: updates,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
);

// 5. ADD ITEM (As a Document in Sub-collection)
app.post(
  "/api/boxes/:id/items",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const boxId = req.params.id;
      const boxRef = db.collection("boxes").doc(boxId);

      // Check if box exists first
      const boxDoc = await boxRef.get();
      if (!boxDoc.exists)
        return res.status(404).json({ error: "Box not found" });

      // Prepare Data
      const port = process.env.PORT || 5000;
      const newItem = {
        name: req.body.name,
        value: req.body.value,
        chance: req.body.chance,
        // Store reference to parent box if needed later, but not strictly necessary
        boxId: boxId,
        image: req.file
          ? `http://localhost:${port}/uploads/${req.file.filename}`
          : null,
      };

      // MAGIC MOMENT: Save to 'items' sub-collection
      // Firestore generates a unique ID for us here!
      const itemRef = await boxRef.collection("items").add(newItem);

      res.status(201).json({
        message: "Item added successfully",
        itemId: itemRef.id, // <--- We send this ID back to frontend!
        item: newItem,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// PUT: Update a specific item inside the array
app.put(
  "/api/boxes/:boxId/items/:itemId",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { boxId, itemId } = req.params;
      const boxRef = db.collection("boxes").doc(boxId);
      const doc = await boxRef.get();

      if (!doc.exists) return res.status(404).json({ error: "Box not found" });

      let items = doc.data().items || [];

      // 1. Find the index of the item we want to update
      const itemIndex = items.findIndex((item) => item.id === itemId);

      if (itemIndex === -1) {
        return res
          .status(404)
          .json({ error: "Item not found inside this box" });
      }

      // 2. Handle Image Replacement (Delete old file if new one uploaded)
      if (req.file) {
        const oldImage = items[itemIndex].image;
        if (oldImage) {
          const oldFilename = oldImage.split("/").pop();
          const oldFilePath = path.join(process.cwd(), "uploads", oldFilename);
          if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
        }

        const port = process.env.PORT || 5000;
        items[itemIndex].image =
          `http://localhost:${port}/uploads/${req.file.filename}`;
      }

      // 3. Update other fields (only if provided)
      if (req.body.name) items[itemIndex].name = req.body.name;
      if (req.body.value) items[itemIndex].value = req.body.value;
      if (req.body.chance) items[itemIndex].chance = req.body.chance;

      // 4. Save the WHOLE array back to Firestore
      await boxRef.update({ items: items });

      res.status(200).json({ message: "Item updated", item: items[itemIndex] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// 7. DELETE ITEM (Targeting the Sub-collection Doc)
app.delete(
  "/api/boxes/:boxId/items/:itemId",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { boxId, itemId } = req.params;

      // Reference the specific item document
      const itemRef = db
        .collection("boxes")
        .doc(boxId)
        .collection("items")
        .doc(itemId);

      // 1. Get it first to delete the image
      const itemDoc = await itemRef.get();
      if (!itemDoc.exists) {
        return res.status(404).json({ error: "Item not found" });
      }

      const itemData = itemDoc.data();

      // 2. Image Cleanup
      if (itemData.image) {
        const filename = itemData.image.split("/").pop();
        const filePath = path.join(process.cwd(), "uploads", filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      // 3. Delete the document
      await itemRef.delete();

      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// NEW ROUTE: GET ALL ITEMS FOR A SPECIFIC BOX
app.get("/api/boxes/:id/items", async (req, res) => {
  try {
    const boxId = req.params.id;
    const itemsRef = db.collection("boxes").doc(boxId).collection("items");
    const snapshot = await itemsRef.get();

    const items = [];
    snapshot.forEach((doc) => {
      // Include the Firestore ID in the response
      items.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 1: Create Payment Link (Called by Frontend) ---
app.post("/api/create-checkout-session", express.json(), async (req, res) => {
  const { amount, userId } = req.body;

  // Security Check
  if (!amount || amount < 5) {
    return res.status(400).json({ error: "Minimum deposit is $5" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Mystery Box Credits",
              // images: ['https://your-site.com/logo.png'],
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Redirect user here after payment
      success_url: "http://localhost:3000/profile",
      cancel_url: "http://localhost:3000/deposit",
      client_reference_id: userId, // Attach User ID to track who paid
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- ROUTE 2: Stripe Webhook (The Security Guard) ---
// This verifies the payment really happened before adding money.
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    // REPLACE with your 'whsec_...' key
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const amountAdded = session.amount_total / 100; // Cents to Dollars
      const paymentId = session.payment_intent;

      console.log(`Processing deposit of $${amountAdded} for ${userId}`);

      try {
        await db.runTransaction(async (t) => {
          const userRef = db.collection("users").doc(userId);
          const txRef = db.collection("all_transactions").doc(paymentId);

          const txDoc = await t.get(txRef);
          if (txDoc.exists) return; // Already processed

          const userDoc = await t.get(userRef);
          if (!userDoc.exists) throw new Error("User not found");

          const newBalance =
            (Number(userDoc.data().balance) || 0) + amountAdded;

          // Update Balance & Log Transaction
          t.update(userRef, { balance: newBalance });
          t.set(txRef, {
            type: "DEPOSIT",
            amount: amountAdded,
            userId: userId,
            email: userDoc.data().email,
            stripePaymentId: paymentId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            description: "Stripe Deposit",
            status: "completed",
          });
        });
        console.log("Balance updated successfully");
      } catch (error) {
        console.error("Transaction failed:", error);
        return res.status(500).send("Internal Error");
      }
    }

    res.json({ received: true });
  },
);

// 4. Test Route
app.get("/", (req, res) => {
  res.send("Hyperboxes Backend with FIREBASE is Live!");
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
