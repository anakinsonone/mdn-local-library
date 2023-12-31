const Author = require('../models/author');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');

// Display list of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({family_name: 1}).exec();

  res.render('author_list', {
    title: 'Author List',
    author_list: allAuthors,
  });
});

// Display details of a specific author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  const {params} = req;
  const {id} = params;

  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(id).exec(),
    Book.find({author: id}, 'title summary').exec(),
  ]);

  if (author === null) {
    const err = new Error('Author not found.');
    err.status = 400;
    return next(err);
  }

  res.render('author_detail', {
    title: 'Author detail',
    author,
    author_books: allBooksByAuthor,
  });
});

// Display author create form on GET
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author create GET');
});

// Handle author create on POST
exports.author_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author create POST');
});

// Display author delete from on GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author delete GET');
});

// Handle author delete on POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author delete POST');
});

// Display author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author update GET');
});

// Handle author update on POST
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author update POST');
});
