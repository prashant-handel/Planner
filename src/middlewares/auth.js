const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // Check for token
    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Please login to continue'
      });
    }

    // Verify token
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;

    // Find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = userAuth;
