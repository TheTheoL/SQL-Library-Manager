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
    book = await Book.create(req.body);
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
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  if(book) {
      res.render('update-book', { title: book.title, books } );
  }else {
    res.sendStatus(404);
  }
}));

//Route that updates book info in the database 
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  try {
    await book.update(req.body);
    res.redirect('/books');
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      const book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { book, errors: error.errors, title: "Update Book" });
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

//404
router.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = 'Page Not Found';
  console.log(error.status, error.message);
  res.status(404).render('page-not-found', { error });
  next(error);
});

//Global
router.use((error, req, res, next) => {
  if (error) {
    console.log('Global error handler called', error);
  }
  if (error.status === 404){
   res.status(404).render('page-not-found', { error });
  } else {
   error.status = 500;
   error.message = 'Something Went Wrong';
   console.log(error.message, error.status);
   res.status(500).render('error', { error });
  }
});


module.exports = router;