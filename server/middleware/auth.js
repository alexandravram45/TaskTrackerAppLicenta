const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const Blacklist = require('../user/Blacklist');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.cookie;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const cookiesArray = authHeader.split(';').map(cookie => cookie.trim());

  // Find the cookie with name 'SessionID'
  const accessTokenCookie = cookiesArray.find(cookie => cookie.startsWith('SessionID='));

  if (!accessTokenCookie) {
    return res.status(401).json({ message: 'Invalid cookie format' });
  }

  // Extract the token from the cookie
  const accessToken = accessTokenCookie.split('=')[1];

  const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });

  if (checkIfBlacklisted) {
    return res.status(401).json({ message: 'This session has expired. Please login' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);

    const { id } = decoded;
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'This session has expired. Please login.' });
  }
};
