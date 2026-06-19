const { db } = require('../config/db');
const path = require('path');
const fs = require('fs');

// @desc    Create a new Mystery Box
// @route   POST /api/boxes
// @access  Private (Admin only - we will add protection later)
const createBox = async (req, res) => {
  try {
    const { title, price, image } = req.body; 

    // 1. Validate
    if (!title || !price || !image) {
      return res.status(400).json({ error: 'Please provide title, price, and image URL' });
    }

    // 2. Generate ONE ID explicitly
    const newBoxRef = db.collection('boxes').doc(); 

    // 3. Prepare Object
    const newBox = {
      id: newBoxRef.id, // Save the ID inside the document
      title: title,
      price: parseFloat(price),
      image: image,
      createdAt: new Date().toISOString(),
      active: true
    };

    // 4. SAVE using .set() (Not .add)
    await newBoxRef.set(newBox);

    // 5. Send Response with the SAME ID
    res.status(201).json({
      success: true,
      id: newBoxRef.id, // <--- Crucial: Matches the ID we just saved to
      ...newBox
    });

  } catch (error) {
    console.error("Create Box Error:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const getBoxes = async (req, res) => {
    try {
        const snapshot = await db.collection('boxes').get();
        const boxes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(boxes);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

// const getBoxes = async (req, res) => {
//     try {
//         const snapshot = await db.collection('boxes').get();
//         const boxes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         res.json(boxes);
//     } catch (error) {
//         res.status(500).json({ error: 'Server Error' });
//     }
// }



module.exports = { createBox, getBoxes };