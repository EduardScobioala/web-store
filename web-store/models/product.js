const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type : String,
        maxLength: 8,
        required: true,
    },
    productName: {
        type : String,
        maxLength: 30,
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