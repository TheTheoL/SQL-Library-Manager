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
  let book;
  try {
    const book = await Book.create(req.body);
    res.redirect("/");
  
  } catch (error) {
    if(error.name === "SequelizeValidationError") { 
      book = await Book.build(req.body);
      res.render("new-books", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error; 
    }  
  }
}));

// /books.:id to show book detail form
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  if(book) {
      res.render('update-book', { title: book.title, book } );
  }else {
    const err = new Error();
    err.status = 404;
    err.message = 'Sorry, cannot find book.';
    next(err);
  }
}));

//Route that updates book info in the database 
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  try {
    await book.update(req.body);
    res.redirect('/');
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      const book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { title: 'Update Book', book, errors: error.errors});
      next(error);
    } else {
      throw error;
    }
  }
}));

//POST the page to delete books from the database. CANNOT BE UNDONE
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  
        try {
            await book.destroy();
            res.redirect('/');
    } catch (error) {
      throw error;
    }   
  
}));

//ERROR HANDLERS

//404 error handler
router.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = 'Sorry, page does not exist.';
  console.log(error.status, error.message);
  res.status(404).render('page-not-found', { error });
  next(error);
});

//Global error handler
router.use((error, req, res, next) => {
  
  if (error.status === 404){
   res.status(404).render('page-not-found', { error });
  } else {
   error.status = 500;
   error.message = 'Oh no! Server is having issues with that';
   console.log(error.message, error.status);
   res.status(500).render('error', { error });
  }
});

module.exports = router;