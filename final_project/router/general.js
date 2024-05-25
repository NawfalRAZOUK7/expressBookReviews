const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Return the list of books as JSON
  return res.status(200).json({ books: books });
});

// Get book details based on ID
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ID from the request parameters
  const id = parseInt(req.params.isbn);
  
  // Check if the ID is valid
  if (!isNaN(id)) {
    // Find the book with the matching ID
    const book = books[id];

    // If the book is found, return its details as JSON
    if (book) {
      return res.status(200).json(book);
    } else {
      // If the book is not found, return a 404 Not Found error
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    // If the ID is not a valid number, return a 400 Bad Request error
    return res.status(400).json({ message: "Invalid ID format" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author;

  // Array to store books with matching author
  const matchedBooks = [];

  // Iterate through the books object to find books with matching author
  Object.values(books).forEach(book => {
    if (book.author === author) {
      matchedBooks.push(book);
    }
  });

  // If no books with matching author are found, return a 404 Not Found error
  if (matchedBooks.length === 0) {
    return res.status(404).json({ message: "No books found for the author" });
  }

  // If books with matching author are found, return them as JSON
  return res.status(200).json(matchedBooks);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
