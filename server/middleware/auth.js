const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vyapaarscore_secret_jwt_key_2026_safe_dev');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User account no longer exists.' });
      }

      if (!user.isVerified) {
        return res.status(403).json({ success: false, message: 'Account is not email-verified. Please verify your email first.', requiresVerification: true, email: user.email });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[AUTH MIDDLEWARE ERROR]', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Token missing.' });
  }
};

module.exports = { protect };
