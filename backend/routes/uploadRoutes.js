const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {verifyToken, verifyAdmin} = require('../middleware/authMiddleware');

// 1. Configure Local Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Images save to 'uploads' folder
  },
  filename(req, file, cb) {
    // Rename file to avoid duplicates: fieldname-date.jpg
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. Filter (Only allow Images)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 3. The Upload Route
// We allow uploading a single file with the key "image"
router.post('/', verifyToken, verifyAdmin, upload.single('image'), (req, res) => {
  if(req.file) {
      res.send(`/${req.file.path.replace(/\\/g, "/")}`); // Return the path to save in DB
  } else {
      res.status(400).send('No file uploaded');
  }
});

module.exports = router;