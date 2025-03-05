const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Book = require('../models/Book');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('reviews');
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    next(error);
  }
});


router.post(
  '/',
  verifyToken,
  isAdmin,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
    check('description', 'Description must be at least 10 characters').isLength({ min: 10 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newBook = new Book(req.body);
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
