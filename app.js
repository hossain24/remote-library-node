var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');
var userRouter = require('./routes/user');
var ordersRouterTest = require('./routes/ordersTest');
var ordersRouter = require('./routes/orders');
var userAuthRouter = require('./routes/user-auth');

var app = express();
app.use(cors({ credentials: true }));

const db = mongoose.connect('mongodb+srv://hossain:Fg6OebLZlKxaty3q@cluster0.0gqec.mongodb.net/portfolioAPI?retryWrites=true&w=majority',
  console.log("Database is connected!"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS consfiguration options
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

app.use('/user', userRouter);
app.use('/orders', ordersRouter);
app.use('/users-test', usersRouter);
app.use('/orders-test', ordersRouterTest);
app.use('/user-auth', userAuthRouter);

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
  res.render('error');
});

module.exports = app;
