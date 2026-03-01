const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

async function register(username, email, password) {
  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userService.create({ username, email, password: hashedPassword });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
}

async function login(email, password) {
  const user = await userService.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
}

async function verifyToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error('Invalid or expired token');
  }

  const user = await userService.findById(decoded.id);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await userService.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userService.updatePassword(userId, hashedPassword);

  return { message: 'Password updated successfully' };
}

module.exports = { register, login, verifyToken, changePassword };
