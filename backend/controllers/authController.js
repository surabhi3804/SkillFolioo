// backend/controllers/authController.js
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../models/User');
const { sendResetEmail } = require('../utils/sendEmail');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/* ══════════════════════════════════════════════════════════════
   POST /api/auth/register
══════════════════════════════════════════════════════════════ */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   POST /api/auth/login
══════════════════════════════════════════════════════════════ */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   GET /api/auth/me
══════════════════════════════════════════════════════════════ */
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

/* ══════════════════════════════════════════════════════════════
   PUT /api/auth/update
══════════════════════════════════════════════════════════════ */
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   POST /api/auth/forgot-password
   - Finds user by email
   - Generates a secure random token (not JWT) stored hashed in DB
   - Sends reset link to user's email via nodemailer
══════════════════════════════════════════════════════════════ */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required.' });

    const user = await User.findOne({ email });

    // Always respond with success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    // Generate raw token — this is what goes in the email link
    const rawToken  = crypto.randomBytes(32).toString('hex');
    // Store hashed version in DB
    const hashed    = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken   = hashed;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    try {
      await sendResetEmail({ to: user.email, name: user.name, resetURL });
    } catch (emailErr) {
      // Roll back token if email fails so user can try again
      user.resetPasswordToken   = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Email send error:', emailErr);
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again.',
      });
    }

    return res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('forgotPassword error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   POST /api/auth/reset-password/:token
   - Hashes the raw token from URL
   - Finds user where hash matches and token is not expired
   - Updates password, clears token fields
══════════════════════════════════════════════════════════════ */
const resetPassword = async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 7)
      return res.status(400).json({ success: false, message: 'Password must be at least 7 characters.' });

    // Hash the token from the URL to compare against DB
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:   hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.',
      });

    // Update password — the pre-save hook will hash it
    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Log user in immediately with a fresh token
    const authToken = generateToken(user._id);
    res.json({
      success: true,
      message: 'Password reset successfully.',
      token:   authToken,
      user:    { id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword };