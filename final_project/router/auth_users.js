const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = {
  test: { password: 'test' },
  test2: { password: 'test2' },
};

const isValid = (username) => {
  return users.hasOwnProperty(username);
};

const authenticatedUser = (username, password) => {
  return users[username] && users[username].password === password;
};

// Only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: 'Invalid username' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username }, 'place_holder_key_for_testing', {
    expiresIn: '1h',
  });

  req.session.token = token;

  return res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const reviews = {};

  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  if (!review) {
    return res.status(400).json({ message: 'Review is required' });
  }

  if (!reviews[isbn]) {
    reviews[isbn] = {};
  }

  reviews[isbn][username] = review;

  return res.status(200).json({
    message: 'Review added/modified successfully',
    reviews: reviews[isbn],
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
