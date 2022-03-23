const mongoose = require('mongoose');
const Order = require('../Models/Order');
const Book = require('../Models/Book');

// exports.orders_get_all = (req, res, next) => {
//     Order.find()
//         .select("book quantity _id")
//         .populate('book', 'title')
//         .exec()
//         .then(docs => {
//             res.status(200).json({
//                 count: docs.length,
//                 orders: docs.map(doc => {
//                     return {
//                         _id: doc._id,
//                         book: {
//                             title: doc.book.title,
//                         },
//                         quantity: doc.quantity,
//                         request: {
//                             type: "GET",
//                             url: "http://localhost:5000/orders/" + doc._id
//                         }
//                     };
//                 })
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

exports.orders_get_all = ('/', (req, res, next) => {
    Order.find()
        .select("_id  book title author quantity")
        .populate("book")
        .exec()
        .then(docs => {
            const response =
                //count: docs.length,
                docs.map(doc => {
                    return {
                        _id: doc._id,
                        book: {
                            title: doc.book.title,
                            author: doc.book.author,
                            description: doc.book.description,
                            description: doc.book.description,
                            language: doc.book.language,
                            bookImage: "http://localhost:5000/" + doc.book.bookImage
                        },
                        quantity: doc.quantity,
                        count: docs.length,
                        request: {
                            type: "GET",
                            url: "http://127.0.0.1:5000/books/" + doc._id
                        }
                    };
                })

            if (docs.length >= 0) {
                res.status(200).send(response);
            } else {
                res.status(404).send({ message: "No data found!" })
            }
        })
        .catch(err => res.status(500).send({ message: "There is en error!" }));
});


// exports.orders_get_all = (req, res, next) => {
//     Order.find()
//         .select("book quantity _id")
//         .populate('book', 'title')
//         .exec()
//         .then(docs => {
//             res.status(200).json({
//                 // count: docs.length,
//                 orders: docs.map(doc => {
//                     return {
//                         _id: doc._id,
//                         book: doc.book,
//                         quantity: doc.quantity,
//                         request: {
//                             type: "GET",
//                             url: "http://localhost:3000/orders/" + doc._id
//                         }
//                     };
//                 })
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// };


exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('book')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:5000/orders"
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_create_order = (req, res, next) => {
    Book.findById(req.body.bookId)
        .then(book => {
            if (!book) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                book: req.body.bookId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order is stored",
                createdOrder: {
                    _id: result._id,
                    book: result.book,
                    quantity: result.quantity
                },
                request: {
                    type: "POST",
                    url: "http://localhost:5000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order is deleted",
                request: {
                    type: "DELETE",
                    url: "http://localhost:5000/orders",
                    body: { productId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
