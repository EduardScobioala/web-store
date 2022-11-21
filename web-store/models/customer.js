const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    cardNumber: {
        type : String,
        maxLength: 8,
        required: true
    },
    lastName: {
        type : String,
        maxLength: 20,
        required: true
    },
    firstName: {
        type : String,
        maxLength: 20,
        required: true
    },
    dateOfBirth: {
        type : String,
        maxLength: 15,
        required: true
    }
})

module.exports = mongoose.model("Customer", customerSchema);