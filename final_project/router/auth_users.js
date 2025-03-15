const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "your_jwt_secret_key";

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};


//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username or password is missing." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials. Please try again." });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    req.session.token = token;

    return res.status(200).json({ message: "Login successful!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // Retrieved from JWT token

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Add or update review
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
