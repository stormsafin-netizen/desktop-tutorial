// Simulated in-memory user store (replace with real DB queries in production)
const users = [];
let nextId = 1;

function findByEmail(email) {
  return Promise.resolve(users.find((u) => u.email === email) || null);
}

function findById(id) {
  return Promise.resolve(users.find((u) => u.id === id) || null);
}

function create(userData) {
  const user = { id: nextId++, ...userData };
  users.push(user);
  return Promise.resolve(user);
}

function updatePassword(userId, hashedPassword) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return Promise.reject(new Error('User not found'));
  }
  user.password = hashedPassword;
  return Promise.resolve();
}

module.exports = { findByEmail, findById, create, updatePassword };
