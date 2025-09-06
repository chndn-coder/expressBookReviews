const express = require('express');
const jwt = require('jsonwebtoken'); 
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a username already exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Check if username/password pair is correct
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT
  const token = jwt.sign(
    { username: user.username },
    "access",         
    { expiresIn: "1h" }
  );

  // Store username in session for review routes
  req.session.authorization = { username: user.username };

  res.json({
    message: "Login successful",
    token: token
  });
});

// Add or modify a book review
regd_users.put("/review/:isbn", authMiddleware, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  let book = books[isbn];
  if (book) {
    // Use username from JWT
    let username = req.user.username;

    book.reviews[username] = review;

    return res.status(200).json({
      message: `Review for book ${isbn} added/updated successfully`,
      reviews: book.reviews,
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// DELETE review for a book
regd_users.delete("/auth/review/:isbn", authMiddleware, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // from JWT

  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }

  // Delete the user’s review
  delete book.reviews[username];

  return res.status(200).json({
    message: `Review by ${username} deleted successfully`,
    reviews: book.reviews,
  });
});


// JWT authentication middleware
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (token) {
    const jwtToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    jwt.verify(jwtToken, 'access', (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "Token not provided" });
  }
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
