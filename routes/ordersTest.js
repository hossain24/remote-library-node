const exprees = require('express');
const router = exprees.Router();
const mongoose = require("mongoose");
const Order = require("../model/Order");
const Book = require("../model/Book");

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        book: req.body.bookId
    });
    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;