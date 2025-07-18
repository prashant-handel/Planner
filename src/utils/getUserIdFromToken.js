const jwt = require('jsonwebtoken');

const getUserIdFromToken = (req) => {
  try {
    const token = req.cookies.token;
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    return decodedObj._id;
  } catch (err) {
    return null;
  }
};

module.exports = getUserIdFromToken;
