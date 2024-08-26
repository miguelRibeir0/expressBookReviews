const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const testUsers = [
  { username: 'test', password: 'test' },
  { username: 'test2', password: 'test2' },
];

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  if (testUsers[username]) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  testUsers[username] = { password };

  return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: 'Book not found' });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = decodeURIComponent(req.params.author);
  const bookKeys = Object.keys(books);
  const booksByAuthor = bookKeys
    .map((key) => books[key])
    .filter((book) => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = decodeURIComponent(req.params.title);
  const bookKeys = Object.keys(books);
  const booksByTitle = bookKeys
    .map((key) => books[key])
    .filter((book) => book.title === title);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: 'Book not found' });
});

module.exports.general = public_users;
