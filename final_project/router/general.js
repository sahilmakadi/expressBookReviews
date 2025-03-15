const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let { username, password } = req.body; // Correct way to get POST data

    if (!username || !password) {
        return res.status(400).send("Username or password is missing.");
    }

    let userExists = users.users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).send("User already exists.");
    }

    // Add new user
    users.users.push({ username, password });

    res.status(201).send(`User added: ${username}`);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
    let book = Object.values(books).find(b => b.isbn === isbn); // Find book by ISBN
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).send("No book found with this ISBN.");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
    let book = Object.values(books).find(b => b.author === author); // Find book by ISBN
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).send("No book found with this ISBN.");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
    let book = Object.values(books).find(b => b.title === title); // Find book by ISBN
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).send("No book found with this ISBN.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
    let book = Object.values(books).find(b => b.isbn === isbn); // Find book by ISBN
    
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).send("No book found with this ISBN.");
    }
});

module.exports.general = public_users;
