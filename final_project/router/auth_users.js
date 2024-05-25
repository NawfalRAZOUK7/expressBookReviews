const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { "username": "test", "password": "test1234" }
];

const isValid = (username) => {
  // Check if the username is valid
  // For example, you might check if the username meets certain criteria such as length, format, etc.
  // For simplicity, let's assume any non-empty string is considered valid
  return username && typeof username === 'string';
}

const authenticatedUser = (username, password) => {
  // Check if the username and password match the ones in our records
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // Return true if user is found, false otherwise
}

// only registered users can login
regd_users.post("/login", (req,res) => {
  // Retrieve username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username format" });
  }

  // Check if the username and password match the ones in our records
  const isAuthenticated = authenticatedUser(username, password);
  if (!isAuthenticated) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // If the user is authenticated, generate a JWT
  const secretKey = 'e72b6dab8645cc047a5fde0a7428e12d8300b43fc8238e5c3e7e8254bf5573f2'; // Example actual secret key
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

  // Return a success message along with the JWT as part of the login response
  return res.status(200).json({ message: "Customer successfully logged in", token });
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Check if Authorization header is present
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - Missing or invalid Authorization header" });
  }

  // Extract JWT token
  const token = authorizationHeader.split(" ")[1];

  // Verify JWT token
  try {
    const decoded = jwt.verify(token, 'e72b6dab8645cc047a5fde0a7428e12d8300b43fc8238e5c3e7e8254bf5573f2');
    const username = decoded.username;

    // Retrieve ISBN from request parameters
    const isbn = req.params.isbn;

    // Retrieve review from request query
    const review = req.query.review;

    // Initialize reviews array if it doesn't exist for the book
    if (!books[isbn].reviews || !Array.isArray(books[isbn].reviews)) {
      books[isbn].reviews = [];
    }

    // Check if the user has already posted a review for the same ISBN
    const existingReviewIndex = books[isbn].reviews.findIndex(item => item.username === username);

    if (existingReviewIndex !== -1) {
      // If the user has already posted a review, modify the existing review
      books[isbn].reviews[existingReviewIndex].review = review;
    } else {
      // If the user has not posted a review, add a new review
      books[isbn].reviews.push({ username, review });
    }

    // Return a success message along with the updated book reviews
    return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Unauthorized - Invalid JWT token' });
  }
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
