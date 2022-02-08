const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const bookSchema = new Schema({
    _id: ObjectId,
    title: String,
    author: String,
    description: String,
    language: String,
    bookImage: String
})

module.exports = mongoose.model('Book', bookSchema);