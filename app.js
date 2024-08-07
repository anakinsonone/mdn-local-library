const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

require('dotenv').config();
const {DATABASE_URL} = process.env;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();
const prod = process.env.NODE_ENV === 'production';

mongoose.set('strictQuery', false);
main().catch((error) => console.log(error));

/**
 * Connects to the MongoDB database using the specified URL.
 *
 * @async
 * @function main
 * @throws {Error} If there is an issue connecting to the database.
 */
async function main() {
  await mongoose.connect(DATABASE_URL);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: prod,
      httpOnly: prod,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // log errors in development
  const dev = process.env.NODE_ENV === 'development';
  if (dev) {
    console.log(err.message, err.stack);
  }
  res.render('error');
});

module.exports = app;
