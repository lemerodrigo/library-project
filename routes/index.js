const express = require('express');
const router  = express.Router();
const Book = require('../models/book.js');
const Author = require('../models/author.js');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/books', (req, res, next) => {
  Book.find()
    .then(books => {
      res.render("books", { books });
    })
    .catch(error => {
      console.log(error)
    })
});

router.get('/books/add', (req, res, next) => {
  res.render("book-add")
});

router.post('/books/add', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  const newBook = new Book({ title, author, description, rating});
  newBook.save()
  .then((book) => {
    console.log('Livro criado', book);
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error)
  })
});

router.get('/books/edit', (req, res, next) => {
  Book.findOne({_id: req.query.book_id})
  .populate('author')
  .then((book) => {
    console.log(book)
    res.render("book-edit", {book})
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post('/books/edit', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  Book.update({_id: req.query.book_id}, { $set: {title, author, description, rating }})
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error)
  })
});

router.get('/book/:id', (req, res, next) => {
  let bookId = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(bookId)) { 
    return res.status(404).render('not-found');
  }
  Book.findOne({'_id': bookId})
    .populate('author')
    .then(book => {
      console.log(book)
      if (!book) {
          return res.status(404).render('not-found');
      }
      res.render("book-detail", { book })
    })
    .catch(next)
});

router.get('/authors/add', (req, res, next) => {
  res.render("author-add")
});

router.post('/authors/add', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl})
  newAuthor.save()
  .then((book) => {
    res.redirect('/books')
  })
  .catch((error) => {
    console.log(error)
  })
});

module.exports = router;
