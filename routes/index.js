var express = require('express');
var router = express.Router();
const Books = require('../models/books.js').Books 

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  const allBooks = await Books.findAll();
});
console.log(allBooks.toJSON());
module.exports = router;
