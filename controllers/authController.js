const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with hashed password
    const user = new User({ name, email, mobile, password });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// // Login User
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   const trimmedPassword = password.trim();  // Trim any extra spaces
//   console.log("Entered Password (after trim):", trimmedPassword);

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("User not found with email:", email);
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Compare entered password with stored hash
//     const isMatch = await user.matchPassword(trimmedPassword);
//     console.log("Password Match Result:", isMatch);

//     if (!isMatch) {
//       console.log("Password mismatch for email:", email);
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token if password matches
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     console.log("JWT Token:", token);
//     res.status(200).json({ message: 'Login successful', token,user });
//   } catch (err) {
//     console.error("Error during login:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const trimmedPassword = password.trim();  // Trim any extra spaces
  console.log("Entered Password (after trim):", trimmedPassword);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare entered password with stored hash
    const isMatch = await user.matchPassword(trimmedPassword);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token if password matches
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("JWT Token:", token);

    // Send response with user object including scholarFormId
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        ...user.toObject(), // Convert Mongoose document to plain object
        scholarFormId: user.scholarFormId, // Include scholarFormId explicitly
      }
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Create a reset token (expires in 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send password reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click on the link below to reset your password:\n\n` +
            `http://your-app.com/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    user.password = newPassword;  // Set the new password directly
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};





const editProfile = async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    // Find the user to update
    const user = req.user; // This comes from the protect middleware

    // You can update only the fields provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    // Save the updated user data to the database
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, editProfile };
