const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'vyapaarscore_secret_jwt_key_2026_safe_dev';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Helper: Include dev OTP only if dev mode is enabled and HIDE_DEV_OTP is not true
const shouldSendDevOtp = () => {
  return process.env.NODE_ENV !== 'production' && process.env.HIDE_DEV_OTP !== 'true';
};

// 1. SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, businessName, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, Email, and Password are required.' });
    }

    if (role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin account creation is restricted. Only one system admin account exists for this platform.',
      });
    }

    const selectedRole = role === 'lender' ? 'lender' : 'merchant';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please login.' });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, salt);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        existingUser.name = name;
        existingUser.businessName = businessName || existingUser.businessName;
        existingUser.phone = phone || existingUser.phone;
        existingUser.password = hashedPassword;
        existingUser.role = selectedRole;
        existingUser.otpHash = otpHash;
        existingUser.otpExpiresAt = otpExpiresAt;
        await existingUser.save();

        await sendOTPEmail(existingUser.email, otp, 'VyapaarScore Verification Code');

        return res.status(200).json({
          success: true,
          message: 'Account updated. Verification code sent to your email.',
          email: existingUser.email,
          role: existingUser.role,
          devOtp: shouldSendDevOtp() ? otp : undefined,
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, salt);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.create({
      name,
      businessName: businessName || '',
      email: email.toLowerCase(),
      phone: phone || '',
      password: hashedPassword,
      role: selectedRole,
      isVerified: false,
      otpHash,
      otpExpiresAt,
    });

    await sendOTPEmail(user.email, otp, 'VyapaarScore Verification Code');

    res.status(201).json({
      success: true,
      message: 'Registration successful! Verification code sent to your email.',
      email: user.email,
      role: user.role,
      devOtp: shouldSendDevOtp() ? otp : undefined,
    });
  } catch (error) {
    console.error('[SIGNUP ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during signup.' });
  }
});

// 2. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'No active OTP request found. Please request a new code.' });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please click Resend Code.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Account successfully verified!',
      token,
      user: {
        id: user._id,
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('[VERIFY OTP ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during OTP verification.' });
  }
});

// 3. RESEND OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.otpHash = await bcrypt.hash(otp, salt);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, otp, 'VyapaarScore New Verification Code');

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email.',
      email: user.email,
      devOtp: shouldSendDevOtp() ? otp : undefined,
    });
  } catch (error) {
    console.error('[RESEND OTP ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during OTP resend.' });
  }
});

// 4. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password, loginMode, targetRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const ADMIN_EMAIL = 'premalalitha08@gmail.com';

    // Strict Admin authorization check
    if (loginMode === 'admin' && cleanEmail !== ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only premalalitha08@gmail.com is authorized as System Admin.',
      });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Allow 2312035@nec.edu.in to switch stakeholder roles (merchant/lender) for developer testing
    if (cleanEmail === '2312035@nec.edu.in' && targetRole && ['merchant', 'lender'].includes(targetRole)) {
      user.role = targetRole;
    }

    // Mandatory Email 2FA Security OTP for EVERY user login attempt
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.otpHash = await bcrypt.hash(otp, salt);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const isAdminUser = cleanEmail === ADMIN_EMAIL || user.role === 'admin';
    const emailSubject = isAdminUser
      ? 'VyapaarScore Admin Login 2FA Security Code'
      : 'VyapaarScore Account Login Verification Code';

    await sendOTPEmail(user.email, otp, emailSubject);

    return res.status(403).json({
      success: false,
      requiresVerification: true,
      message: `Verification code sent to ${user.email}. Enter the 6-digit code sent to your email to complete login.`,
      email: user.email,
      devOtp: shouldSendDevOtp() ? otp : undefined,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
});

// 5. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset OTP code has been sent.',
      });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.otpHash = await bcrypt.hash(otp, salt);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, otp, 'VyapaarScore Password Reset Code');

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email.',
      email: user.email,
      devOtp: shouldSendDevOtp() ? otp : undefined,
    });
  } catch (error) {
    console.error('[FORGOT PASSWORD ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
});

// 6. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset request.' });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'Reset code has expired.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful!',
    });
  } catch (error) {
    console.error('[RESET PASSWORD ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
});

// 7. GET ME
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      businessName: req.user.businessName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      isVerified: req.user.isVerified,
      initialBalance: req.user.initialBalance || 0,
      createdAt: req.user.createdAt,
    },
  });
});

// 8. UPDATE PROFILE
router.post('/update-profile', protect, async (req, res) => {
  try {
    const { name, businessName, phone, initialBalance } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (businessName !== undefined) user.businessName = businessName;
    if (phone !== undefined) user.phone = phone;
    if (initialBalance !== undefined) user.initialBalance = parseFloat(initialBalance) || 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile details updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        initialBalance: user.initialBalance || 0,
      },
    });
  } catch (error) {
    console.error('[UPDATE PROFILE ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
});

// 9. CHANGE PASSWORD
router.post('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password required.' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('[CHANGE PASSWORD ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
});

module.exports = router;
