'use strict';

const RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  password: {
    minLength: 8,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*]/,
  },
  // E.164 or common North-American/international formats
  phone: /^\+?[\d\s\-().]{7,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// --- Helper utilities ---

function setGroupState(groupId, state, message) {
  const group = document.getElementById(groupId);
  const errorEl = document.getElementById('error-' + groupId.replace('group-', ''));

  group.classList.remove('valid', 'invalid');
  if (state) group.classList.add(state);
  if (errorEl) errorEl.textContent = message || '';
}

function clearGroup(groupId) {
  setGroupState(groupId, '', '');
}

// --- Individual field validators ---

function validateUsername() {
  const value = document.getElementById('username').value.trim();
  const { minLength, maxLength, pattern } = RULES.username;

  if (!value) {
    setGroupState('group-username', 'invalid', 'Username is required.');
    return false;
  }
  if (value.length < minLength) {
    setGroupState('group-username', 'invalid', `Username must be at least ${minLength} characters.`);
    return false;
  }
  if (value.length > maxLength) {
    setGroupState('group-username', 'invalid', `Username must be no more than ${maxLength} characters.`);
    return false;
  }
  if (!pattern.test(value)) {
    setGroupState('group-username', 'invalid', 'Only letters, numbers, and underscores are allowed.');
    return false;
  }

  setGroupState('group-username', 'valid', '');
  return true;
}

function validateEmail() {
  const value = document.getElementById('email').value.trim();

  if (!value) {
    setGroupState('group-email', 'invalid', 'Email address is required.');
    return false;
  }
  if (!RULES.email.test(value)) {
    setGroupState('group-email', 'invalid', 'Please enter a valid email address.');
    return false;
  }

  setGroupState('group-email', 'valid', '');
  return true;
}

function updatePasswordRules(value) {
  const checks = {
    'rule-length':    value.length >= RULES.password.minLength,
    'rule-uppercase': RULES.password.uppercase.test(value),
    'rule-lowercase': RULES.password.lowercase.test(value),
    'rule-number':    RULES.password.number.test(value),
    'rule-special':   RULES.password.special.test(value),
  };

  Object.entries(checks).forEach(([id, met]) => {
    document.getElementById(id).classList.toggle('met', met);
  });

  return Object.values(checks).every(Boolean);
}

function validatePassword() {
  const value = document.getElementById('password').value;

  if (!value) {
    setGroupState('group-password', 'invalid', 'Password is required.');
    updatePasswordRules('');
    return false;
  }

  const allMet = updatePasswordRules(value);
  if (!allMet) {
    setGroupState('group-password', 'invalid', 'Password does not meet all requirements.');
    return false;
  }

  setGroupState('group-password', 'valid', '');
  return true;
}

function validateConfirmPassword() {
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm-password').value;

  if (!confirm) {
    setGroupState('group-confirm-password', 'invalid', 'Please confirm your password.');
    return false;
  }
  if (password !== confirm) {
    setGroupState('group-confirm-password', 'invalid', 'Passwords do not match.');
    return false;
  }

  setGroupState('group-confirm-password', 'valid', '');
  return true;
}

function validatePhone() {
  const value = document.getElementById('phone').value.trim();

  // Phone is optional — skip validation when empty
  if (!value) {
    clearGroup('group-phone');
    return true;
  }
  if (!RULES.phone.test(value)) {
    setGroupState('group-phone', 'invalid', 'Please enter a valid phone number.');
    return false;
  }

  setGroupState('group-phone', 'valid', '');
  return true;
}

function validateTerms() {
  const checked = document.getElementById('terms').checked;
  const errorEl = document.getElementById('error-terms');

  if (!checked) {
    errorEl.textContent = 'You must accept the Terms of Service to continue.';
    return false;
  }

  errorEl.textContent = '';
  return true;
}

// --- Event bindings (validate on blur / change) ---

document.getElementById('username').addEventListener('blur', validateUsername);
document.getElementById('email').addEventListener('blur', validateEmail);

document.getElementById('password').addEventListener('input', function () {
  updatePasswordRules(this.value);
});
document.getElementById('password').addEventListener('blur', function () {
  validatePassword();
  // Re-validate confirm-password whenever password changes
  if (document.getElementById('confirm-password').value) {
    validateConfirmPassword();
  }
});

document.getElementById('confirm-password').addEventListener('blur', validateConfirmPassword);
document.getElementById('phone').addEventListener('blur', validatePhone);
document.getElementById('terms').addEventListener('change', validateTerms);

// --- Form submit ---

document.getElementById('registration-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const isValid = [
    validateUsername(),
    validateEmail(),
    validatePassword(),
    validateConfirmPassword(),
    validatePhone(),
    validateTerms(),
  ].every(Boolean);

  if (!isValid) return;

  // All fields valid — show success banner and reset form
  const form = document.getElementById('registration-form');

  let banner = document.getElementById('success-banner');
  if (!banner) {
    banner = document.createElement('p');
    banner.id = 'success-banner';
    banner.className = 'success-banner';
    banner.textContent = 'Account created successfully!';
    form.parentNode.insertBefore(banner, form);
  }

  form.style.display = 'none';
  banner.classList.add('visible');
});
