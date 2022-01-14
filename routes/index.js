var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
var router = express.Router();


/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
      next(error);
    }
  }
}



//ROUTES

//Home route
router.get('/', asyncHandler(async (req, res) => {
    res.redirect("/books");
}));

//Route for /books
router.get('/books', asyncHandler(async (req, res) => {
    const books = await Book.findAll({});

    if(books) {
      res.render('index', { books });
    } else {
      res.status(404).render('error');
    }
}));

//Route for books/new that renders the new-books template
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-books', { title: 'New Book', book: {} });
}));

//POST New book to database 
router.post('/books/new', asyncHandler(async (req, res) => {
  let newBook;
  try {
    newBook = await Book.create(req.body);
    res.redirect("/");
  
  } catch (error) {
    if(error.name === "SequelizeValidationError") { 
      newBook = await Book.create(req.body);
      res.render("new-books", { newBook, errors: error.errors, title: "New Book" })
    } else {
      throw error; 
    }  
  }
}));

// /books.:id to show book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  const books = await Book.findByPk(req.params.id);

  if(books) {
      res.render('update-book', { title: books.title, books } );
  }else {
    res.sendStatus(404);
  }
}));

//Route that updates book info in the database 
router.get('/books/:id', asyncHandler(async (req, res) => {

  try {
    const books = await Book.findByPk(req.params.id);
    await books.update(req.body);
    res.redirect('/books');
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      const books = await Book.build(req.body);
      books.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { books, errors: error.errors, title: "Update Book" });
    } else {
      throw error;
    }
  }
}));

//POST the page to delete books from the database. CANNOT BE UNDONE
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const books = await Book.findByPk(req.params.id);
  
        try {
            await books.destroy();
            res.redirect('/');
    } catch (error) {
      throw error;
    }   
  
}));

//POST an updated book to the database.
router.post('/books/:id', asyncHandler(async(req, res) => {
  let updateBook;
  try{
    updateBook = await Books.findByPk(req.params.id);
    if(updateBook) {
    await books.update(req.body);
    res.redirect("/");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      updateBook = await Books.build(req.body);
      books.id = req.params.id;
      res.render('update-book', { updateBook, errors: error.errors, title: 'Update Book'});
    } else {
      throw error;
    }
  }
}));
module.exports = router;