const mongoose = require('mongoose');
const Book = require('../Models/Book');


// GET method to read all data  
exports.books_get_all = ('/', (req, res, next) => {
    Book.find()
        .select("_id title author description language bookImage")
        .exec()
        .then(docs => {
            const response =
                // count: docs.length,
                // allBooks: 
                docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        author: doc.author,
                        description: doc.description,
                        language: doc.language,
                        bookImage: "http://localhost:5000/" + doc.bookImage,
                        // request: {
                        //     type: "GET",
                        //     url: "http://127.0.0.1:5000/books/" + doc._id
                        // }
                    };
                })

            if (docs.length >= 0) {
                res.status(200).send(response);
            } else {
                res.status(404).send({ message: "No data found!" })
            }
        })
        .catch(err => res.status(500).send({ message: err }));
});

// GET method to read a data by ID
exports.books_get_book = (req, res, next) => {
    const id = req.params.bookId;

    Book.findById({ _id: id })
        .select("_id title author description language bookImage")
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).send({
                    message: "The book info is fetched",
                    bookInfo: doc,
                    request: {
                        type: "GET",
                        url: "http://127.0.0.1:5000/books/" + doc._id
                    }
                })
            } else {
                res.status(404).send({ message: "No book info found" })
            }
        })
        .catch(err => res.status(500).send({ message: err }));
}

// POST method to create a new data
exports.books_create_book = (req, res, next) => {
    console.log(req.file);
    const book = new Book({
        _id: new mongoose.Types.ObjectId,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        language: req.body.language,
        bookImage: req.file.path
    });

    book.save()
        .then(doc => {
            res.status(201).send({
                message: "The book info is stored",
                storedBookInfo: {
                    _id: doc._id,
                    title: doc.title,
                    author: doc.author,
                    description: doc.description,
                    language: doc.language,
                    request: {
                        type: "POST",
                        url: "http://127.0.0.1:5000/books/" + doc._id
                    }
                }
            })
        })
        .catch(err => res.status(500).send({ message: err }));
}

// UPDATE method to patch an exist data through options loop
exports.books_update_book = (req, res, next) => {
    const id = req.params.bookId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Book.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).send({
                message: "The book info is updated",
                request: {
                    type: "UPDATE",
                    url: "http://127.0.0.1:5000/books/" + id
                }
            })
        })
        .catch(err => res.status(500).send({ message: err }));
}

// UPDATE method to patch an exist data
exports.books_update_book = (req, res, next) => {
    const id = req.params.bookId;

    Book.updateOne({ _id: id }, {
        $set:
        {
            title: req.body.title,
            author: req.body.author
        }
    }).then(result => {
        res.status(200).send({
            message: "The book info is updated",
            request: {
                type: "UPDATE",
                url: "http://127.0.0.1:5000/books/" + id
            }
        })
    })
        .catch(err => res.status(500).send({ message: err }))
}

// DELETE method to remove a data by ID
exports.books_delete_book = (req, res, next) => {
    const id = req.params.bookId;

    Book.findByIdAndRemove({ _id: id })
        .then(result => {
            res.status(200).send({
                message: "The book info is removed",
                request: {
                    type: "DELETE",
                    url: "http://127.0.0.1:5000/books/" + id
                }
            })
        })
        .catch(err => res.status(500).send({ message: err }));
}
