const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); 
const { protect } = require('../middleware/authMiddleware'); 
const Image = require('../models/Image');

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded!' });
    }

    const newImage = await Image.create({
      url: req.file.path,           
      public_id: req.file.filename, 
      uploadedBy: req.user._id      
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: 'Image file upload failed!' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const images = await Image.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching images!' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found!' });
    }

    if (image.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'User not authorized to delete this image!' });
    }

    await image.deleteOne();

    res.json({ message: 'Image successfully removed from your gallery!' });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: 'Server error during image deletion!' });
  }
});

module.exports = router;