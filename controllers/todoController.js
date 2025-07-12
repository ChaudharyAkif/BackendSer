const Todo = require("../models/Todos");
const cloudinary = require("cloudinary").v2;

// Get all todos for authenticated user
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    console.log(`✅ Retrieved ${todos.length} todos for user: ${req.user.email}`);
    res.json(todos);
  } catch (error) {
    console.error("❌ GET todos error:", error);
    res.status(500).json({
      message: "Failed to fetch todos",
      error: error.message,
    });
  }
};

// Create new todo
const createTodo = async (req, res) => {
  try {
    const { title, location, description } = req.body;

    if (!title || !location || !description) {
      return res.status(400).json({
        message: "Title, location, and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const newTodo = new Todo({
      title: title.trim(),
      location: location.trim(),
      description: description.trim(),
      image: req.file.path,
      userId: req.user._id,
    });

    const savedTodo = await newTodo.save();
    console.log("✅ Todo created:", savedTodo._id, "for user:", req.user.email);
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error("❌ Create todo error:", error);
    res.status(500).json({
      message: "Failed to create todo",
      error: error.message,
    });
  }
};

// Update todo
const updateTodo = async (req, res) => {
  try {
    const { title, location, description } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found or unauthorized" });
    }

    const updateFields = {};
    if (title) updateFields.title = title.trim();
    if (location) updateFields.location = location.trim();
    if (description) updateFields.description = description.trim();
    if (req.file) updateFields.image = req.file.path;

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    console.log("✅ Todo updated:", updatedTodo._id, "for user:", req.user.email);
    res.json(updatedTodo);
  } catch (error) {
    console.error("❌ Update todo error:", error);
    res.status(500).json({
      message: "Failed to update todo",
      error: error.message,
    });
  }
};

// Delete todo
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found or unauthorized" });
    }

    await Todo.findByIdAndDelete(req.params.id);

    if (todo.image) {
      try {
        const publicId = todo.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`todos/${publicId}`);
        console.log("✅ Image deleted from Cloudinary");
      } catch (cloudinaryErr) {
        console.log("⚠️ Failed to delete image from Cloudinary:", cloudinaryErr.message);
      }
    }

    console.log("✅ Todo deleted:", todo._id, "for user:", req.user.email);
    res.json({
      message: "Todo deleted successfully",
      deletedTodo: todo,
    });
  } catch (error) {
    console.error("❌ Delete todo error:", error);
    res.status(500).json({
      message: "Failed to delete todo",
      error: error.message,
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
