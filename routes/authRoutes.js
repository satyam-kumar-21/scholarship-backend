// src/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, editProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Forgot Password - Request a password reset
router.post('/forgot-password', forgotPassword);

// Reset Password - Reset the password with the reset token
router.post('/reset-password', resetPassword);

// Edit Profile - Protecting this route with the JWT middleware
router.put('/edit-profile', protect, editProfile);

module.exports = router;
