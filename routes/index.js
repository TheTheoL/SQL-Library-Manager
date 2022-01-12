var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

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

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
    const allBooks = await Book.findAll();
    res.json(allBooks);

}));
module.exports = router;





// I checked out the video you suggested and referred back to the code of one of the small projects I did during the course and I think I got the code right. But my console is still throwing me an error saying 'await is only valid in async functions' even though it is in an async function. 