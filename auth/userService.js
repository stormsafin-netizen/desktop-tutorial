// Simulated in-memory user store (replace with real DB queries in production)
const users = [];
let nextId = 1;

function findByEmail(email, callback) {
  const user = users.find((u) => u.email === email) || null;
  process.nextTick(() => callback(null, user));
}

function findById(id, callback) {
  const user = users.find((u) => u.id === id) || null;
  process.nextTick(() => callback(null, user));
}

function create(userData, callback) {
  const user = { id: nextId++, ...userData };
  users.push(user);
  process.nextTick(() => callback(null, user));
}

function updatePassword(userId, hashedPassword, callback) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return process.nextTick(() => callback(new Error('User not found')));
  }
  user.password = hashedPassword;
  process.nextTick(() => callback(null));
}

module.exports = { findByEmail, findById, create, updatePassword };
