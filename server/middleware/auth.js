const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const Blacklist = require('../user/Blacklist');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.cookie;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const cookiesArray = authHeader.split(';').map(cookie => cookie.trim());

  const accessTokenCookie = cookiesArray.find(cookie => cookie.startsWith('SessionID='));
  if (!accessTokenCookie) {
    return res.status(401).json({ message: 'Invalid cookie format or session expired.' });
  }
  const accessToken = accessTokenCookie.split('=')[1];
  console.log("cookie token:  " + accessToken)

  const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });

  if (checkIfBlacklisted) {
    return res.status(401).json({ message: 'This session has expired. Please login' });
  }

  jwt.verify(accessToken, process.env.SECRET_KEY, async (err, decoded) => {
    if (err){
      console.error('Invalid token: ', err);
      return res.status(401).json({ message: 'This session has expired. Please login.' });
    } else {
      const { id } = decoded;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
      next();      

    }
  });
};
