const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username or password is missing.");
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).send("User already exists.");
    }

    users.push({ username, password });
    res.status(201).send(`User added: ${username}`);
});

// Get the book list
// public_users.get('/', (req, res) => {
//     res.status(200).json(books);
// });

// public_users.get('/', async (req, res) => {
//     try {
//         const response = await axios.get('https://example.com/api/books'); // Replace with actual API
//         res.status(200).json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching books from external API" });
//     }
// });

public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        resolve(books);
    }).then((bookList) => {
        res.status(200).json(bookList);
    }).catch((err) => {
        res.status(500).json({ message: "Error retrieving books" });
    });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', (req, res) => {
//     const { isbn } = req.params;
//     const book = books[isbn];

//     if (book) {
//         return res.status(200).json(book);
//     } else {
//         return res.status(404).send("No book found with this ISBN.");
//     }
// });

public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;

    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("No book found with this ISBN.");
        }
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});


// Get books by author
// public_users.get('/author/:author', (req, res) => {
//     const { author } = req.params;
//     const filteredBooks = Object.values(books).filter(book => book.author === author);

//     if (filteredBooks.length > 0) {
//         return res.status(200).json(filteredBooks);
//     } else {
//         return res.status(404).send("No books found for this author.");
//     }
// });

public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;

    new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === author);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found for this author.");
        }
    })
    .then(filteredBooks => res.status(200).json(filteredBooks))
    .catch(error => res.status(404).json({ message: error }));
});


// Get books by title
// public_users.get('/title/:title', (req, res) => {
//     const { title } = req.params;
//     const filteredBooks = Object.values(books).filter(book => book.title === title);

//     if (filteredBooks.length > 0) {
//         return res.status(200).json(filteredBooks);
//     } else {
//         return res.status(404).send("No books found with this title.");
//     }
// });

public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;

    new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title === title);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found for this author.");
        }
    })
    .then(filteredBooks => res.status(200).json(filteredBooks))
    .catch(error => res.status(404).json({ message: error }));
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).send("No reviews found for this book.");
    }
});

module.exports.general = public_users;
