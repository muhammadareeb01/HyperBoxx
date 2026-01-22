const express = require('express');
const router = express.Router();
const { createBox, getBoxes } = require('../controllers/boxController');

// 1. Import the middleware
const {verifyToken, verifyAdmin} = require('../middleware/authMiddleware');


// 3. Add verifyToken AND upload.single to the POST route
//    GET remains public (no verifyToken)
router.route('/')
    .post(verifyToken, verifyAdmin, createBox) 
    .get(getBoxes);

module.exports = router;