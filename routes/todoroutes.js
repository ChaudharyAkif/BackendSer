const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "todos",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// All routes protected
router.use(authMiddleware);

// Routes
router.get("/todos", todoController.getTodos);
router.post("/todos", upload.single("image"), todoController.createTodo);
router.put("/todos/:id", upload.single("image"), todoController.updateTodo);
router.delete("/todos/:id", todoController.deleteTodo);

module.exports = router;
