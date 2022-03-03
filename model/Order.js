const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const orderSchema = new Schema({
    _id: ObjectId,
    book: { type: ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, default: 1 }
})

module.exports = mongoose.model('Order', orderSchema);