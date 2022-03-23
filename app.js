const http = require('http');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const cookieParser = require("cookie-parser");
const session = require("express-session");

const rootRouter = require('./Routes/root');
const userRouter = require('./Routes/user');
const booksRouter = require('./Routes/books');
const ordersRouterTest = require('./Routes/ordersTest');
const ordersRouter = require('./Routes/orders');
const usersRouter = require('./Routes/users');
const userAuthRouter = require('./Routes/user-auth');
const productsRouter = require('./Routes/products');
const cartRouter = require('./Routes/cart');

dotenv.config();

// A middleware to log incoming request 
app.use(morgan('dev'));

const server = http.createServer(app);
const db = mongoose.connect('mongodb+srv://hossain:' + process.env.Mongo_DB_PW + '@cluster0.0gqec.mongodb.net/portfolioAPI?retryWrites=true&w=majority',
    console.log("Database is connected!"));


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


// app.use(
//     cors({
//         origin: ["http://localhost:3000"],
//         methods: ["GET", "POST"],
//         credentials: true,
//     })
// );

app.use(
    session({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

// A middleware to handle body request
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/files', express.static('files'));


app.use('/', rootRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/orders', ordersRouter);
app.use('/users-test', usersRouter);
app.use('/orders-test', ordersRouterTest);
app.use('/user-auth', userAuthRouter);
app.use('/products', productsRouter);
app.use("/cart", cartRouter);

app.use((req, res, next) => {
    const error = new Error("Page Not Found!");
    error.status = 404;
    next(error);
})


const hostname = '127.0.0.1';
const port = 5000;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.use((req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;