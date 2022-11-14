const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type : String,
        maxLength: 8,
        required: true,
    },
    product: {
        type : String,
        maxLength: 80,
        required: true
    },
    warranty: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type : mongoose.Decimal128,
        required: true
    }
})

module.exports = mongoose.model("Product", productSchema);