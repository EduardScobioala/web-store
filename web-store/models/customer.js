const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    cardNumber: {
        type : String,
        maxLength: 8,
        required: true
    },
    lastName: {
        type : String,
        maxLength: 30,
        required: true
    },
    firstName: {
        type : String,
        maxLength: 30,
        required: true
    },
    dateOfBirth: {
        type : Date,
        required: true
    }
})

module.exports = mongoose.model("Customer", customerSchema);