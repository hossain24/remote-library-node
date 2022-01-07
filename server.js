const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer(app);
const db = mongoose.connect('mongodb+srv://hossain:' + process.env.Mongo_DB_PW + '@cluster0.0gqec.mongodb.net/portfolioAPI?retryWrites=true&w=majority',
    console.log("Database is connected!"));

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});