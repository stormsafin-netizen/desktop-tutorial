const { verifyToken } = require('./auth');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  verifyToken(token, function (err, user) {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticate };
