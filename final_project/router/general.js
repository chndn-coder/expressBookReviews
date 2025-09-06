const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");



public_users.post("/register", (req,res) => {
  
  //Write your code here
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  
});

//Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  // Create a Promise that resolves with books
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  });

  getBooks
    .then((bookData) => {
      res.send(JSON.stringify(bookData, null, 4));
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Task 11: Get book details by ISBN using async/await 
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    // Simulate an asynchronous operation, e.g., fetching from a database
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});
  
// Task 12: Get book details by Author using async-await + axios
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const author = req.params.author;

    
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    return res.send(response.data);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error fetching books by author", error: err.message });
  }
});

// Task 13: Get book details by Title using Promises + axios
public_users.get("/promise/title/:title", (req, res) => {
  const title = req.params.title;

  axios
    .get(`http://localhost:5000/title/${title}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error fetching book by title", error: err.message });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;  // Get ISBN from request parameters
    const book = books[isbn];      // Access the book details

    if (book && book.reviews) {
        res.send(JSON.stringify(book.reviews, null, 4));  // Send the reviews as formatted JSON
    } else {
        res.status(404).send("Book or reviews not found");
    }
  
});

module.exports.general = public_users;
