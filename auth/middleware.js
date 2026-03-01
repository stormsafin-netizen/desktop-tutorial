const { verifyToken } = require('./auth');

async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.slice(7);
    req.user = await verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = { authenticate };
