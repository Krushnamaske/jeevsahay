const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, role, location, profileImage, acceptedTerms } = req.body;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    if (!acceptedTerms) {
      return res.status(400).json({ success: false, message: 'You must accept the Terms & Conditions to sign up.' });
    }

    const allowedRoles = ['reporter', 'volunteer', 'ngo', 'doctor', 'shelter'];
    const safeRole = allowedRoles.includes(role) ? role : 'reporter';
    // Note: 'admin' role can never be self-assigned through public signup.

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      role: safeRole,
      location: location ? location.trim() : '',
      profileImage: profileImage || '',
      acceptedTerms: !!acceptedTerms,
    });

    const token = signToken(user);
    res.cookie('token', token, cookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0]?.message || 'Invalid input.';
      return res.status(400).json({ success: false, message: firstError });
    }
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong while creating your account.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // Generic message on purpose: don't reveal whether the email exists.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated. Contact support.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user);

    const opts = cookieOptions();
    if (remember === false) {
      delete opts.maxAge; // session cookie if "remember me" not checked
    }
    res.cookie('token', token, opts);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong while logging in.' });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  return res.status(200).json({ success: true, user: req.user.toSafeObject() });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond with success to avoid leaking which emails are registered.
    const genericResponse = {
      success: true,
      message: 'If an account exists for that email, a password reset link has been sent.',
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    // NOTE: No email/SMTP service is configured in this project yet, so we
    // cannot actually deliver this link to the user's inbox. We log it to
    // the server console so it works end-to-end in development. To enable
    // real delivery, wire up a transactional email provider (e.g. SendGrid,
    // Resend, Postmark) here and send `resetUrl` to user.email instead.
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;
    console.log(`🔑 Password reset link for ${user.email}: ${resetUrl}`);

    return res.status(200).json({
      ...genericResponse,
      devResetUrl: process.env.NODE_ENV === 'production' ? undefined : resetUrl,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please enter and confirm your new password.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    const jwtToken = signToken(user);
    res.cookie('token', jwtToken, cookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You are now logged in.',
      token: jwtToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
};
