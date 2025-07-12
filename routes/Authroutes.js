const express = require("express")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const User = require("../models/User")
const authController = require("../controllers/authController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)

// Protected routes
router.get("/verify-token", authMiddleware, authController.verifyToken)

module.exports = router
