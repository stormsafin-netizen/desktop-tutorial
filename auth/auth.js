const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

function register(username, email, password, callback) {
  userService.findByEmail(email, function (err, existingUser) {
    if (err) {
      return callback(err);
    }
    if (existingUser) {
      return callback(new Error('Email already in use'));
    }

    bcrypt.hash(password, SALT_ROUNDS, function (err, hashedPassword) {
      if (err) {
        return callback(err);
      }

      const newUser = { username, email, password: hashedPassword };
      userService.create(newUser, function (err, user) {
        if (err) {
          return callback(err);
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        callback(null, { user, token });
      });
    });
  });
}

function login(email, password, callback) {
  userService.findByEmail(email, function (err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(new Error('Invalid credentials'));
    }

    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        return callback(err);
      }
      if (!isMatch) {
        return callback(new Error('Invalid credentials'));
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      callback(null, { user, token });
    });
  });
}

function verifyToken(token, callback) {
  jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      return callback(new Error('Invalid or expired token'));
    }

    userService.findById(decoded.id, function (err, user) {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(new Error('User not found'));
      }

      callback(null, user);
    });
  });
}

function changePassword(userId, currentPassword, newPassword, callback) {
  userService.findById(userId, function (err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(new Error('User not found'));
    }

    bcrypt.compare(currentPassword, user.password, function (err, isMatch) {
      if (err) {
        return callback(err);
      }
      if (!isMatch) {
        return callback(new Error('Current password is incorrect'));
      }

      bcrypt.hash(newPassword, SALT_ROUNDS, function (err, hashedPassword) {
        if (err) {
          return callback(err);
        }

        userService.updatePassword(userId, hashedPassword, function (err) {
          if (err) {
            return callback(err);
          }
          callback(null, { message: 'Password updated successfully' });
        });
      });
    });
  });
}

module.exports = { register, login, verifyToken, changePassword };
