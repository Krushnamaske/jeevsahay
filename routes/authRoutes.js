const express = require('express');
const router = express.Router();
const rateLimit = require('../middleware/rateLimit');
const { protect } = require('../middleware/auth');
const {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many attempts. Please try again in a few minutes.' });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts. Please try again in a few minutes.' });

router.post('/signup', authLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);

module.exports = router;
