const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({
  origin: true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern_gallery', 
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage });

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) return cachedDb;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");

  const db = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = db;
  return db;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/images', async (req, res) => {
  try {
    const Image = mongoose.models.Image || mongoose.model('Image', new mongoose.Schema({
      url: String, public_id: String, createdAt: { type: Date, default: Date.now }
    }));
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images!", error: error.message });
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const Image = mongoose.models.Image || mongoose.model('Image');
    const newImage = new Image({
      url: req.file.path,
      public_id: req.file.filename
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

app.get('/', (req, res) => res.json({ message: "Server is running perfectly! 🚀" }));

module.exports = app;