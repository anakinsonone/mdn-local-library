/* eslint-disable camelcase */
const Author = require('../models/author');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

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
exports.author_create_get = (req, res, next) => {
  res.render('author_form', {title: 'Create Author'});
};

// Handle author create on POST
exports.author_create_post = [
  body('first_name')
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage('First Name must be specified.')
      .isAlphanumeric()
      .withMessage('First Name has non-alphanumeric characters.'),
  body('family_name')
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage('Family Name must be specified.')
      .isAlphanumeric()
      .withMessage('Family Name has non-alphanumeric characters.'),
  body('date_of_birth').optional({values: 'falsy'}).isISO8601().toDate(),
  body('date_of_death').optional({values: 'falsy'}).isISO8601().toDate(),

  asyncHandler(async (req, res, next) => {
    const {body} = req;
    const {first_name, family_name, date_of_birth, date_of_death} = body;

    const errors = validationResult(req);

    const author = new Author({
      first_name,
      family_name,
      date_of_birth,
      date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Create Author',
        author,
        errors: errors.array(),
      });
      return;
    } else {
      const authorExists = await Author.findOne({first_name, family_name})
          .collation({locale: 'en', strength: 2})
          .exec();

      if (authorExists) {
        const {url} = authorExists;
        res.redirect(url);
      } else {
        await author.save();
        const {url} = author;
        res.redirect(url);
      }
    }
  }),
];

// Display author delete from on GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  const {params} = req;
  const {id} = params;
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(id).exec(),
    Book.find({author: id}, 'title summary').exec(),
  ]);

  if (author === null) {
    res.redirect('/catalog/authors');
  }

  res.render('author_delete', {
    title: 'Delete Author',
    author,
    author_books: allBooksByAuthor,
  });
});

// Handle author delete on POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const {body, params} = req;
  const {id} = params;
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(id).exec(),
    Book.find({author: id}, 'title summary').exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    res.render('delete_author', {
      title: 'Delete Author',
      author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    const {authorid} = body;
    await Author.findByIdAndDelete(authorid);
    res.redirect('/catalog/authors');
  }
});

// Display author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author update GET');
});

// Handle author update on POST
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Author update POST');
});
