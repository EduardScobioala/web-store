const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");

// All Transactions route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.transaction != null && req.query.transaction !== "") {
        searchOptions.transaction = new RegExp(req.query.transaction.trim(), "i");
    }
    try {
        const transactions = await Transaction.find(searchOptions);
        res.render("transactions/index", {
            transactions : transactions,
            searchOptions : req.query
        });
    } catch {
        res.redirect("/");
    }
});

// New Transaction route
router.get("/new", (req, res) => {
    res.render("transactions/new", { transaction: new Transaction() });
});

// Create Transaction route
router.post("/", async (req, res) => {
    const rawTransaction = {
        cardNumber : req.body.cardNumber,
        productId : req.body.productId,
        quantity : req.body.quantity,
        dateOfTransaction : req.body.dateOfTransaction
    };

    let transaction;
    try {
        transaction = new Transaction(_dataValidation(rawTransaction));
        const newTransaction = await transaction.save();
        res.redirect("transactions");
    } catch(error) {
        res.render("transactions/new", {
            transaction : rawTransaction,
            errorMessage : error.message
        });
    }
});

function _dataValidation(transaction) {
    // Card Number validation
    transaction.cardNumber = transaction.cardNumber.trim();
    if (transaction.cardNumber.length == 0 ) throw Error("Card Number field mandatory");
    if (transaction.cardNumber.length != 8) throw Error("Card Number field must be of 8 characters");
    if (!/^\d+$/.test(transaction.cardNumber)) throw Error("Card Number field can be made out of only digits");

    // Product ID validation
    transaction.productId = transaction.productId.trim();
    if (transaction.productId.length == 0 ) throw Error("Product ID field mandatory");
    if (transaction.productId.length != 8) throw Error("Product ID field must be of 8 characters");
    if (!/^[a-zA-Z0-9]+$/.test(transaction.productId)) throw Error("Product ID field can be made out of only digits or letters");

    // Quantity validation
    if ((transaction.quantity.trim()).length == 0 ) throw Error("Quantity field mandatory");
    if (!/^[0-9]+$/.test(transaction.quantity)) throw Error("Quantity field can be made out of only digits");
    transaction.quantity = parseInt(transaction.quantity);
    if (transaction.quantity > 200) throw Error("Quantity cannot be bigger than 200");

    // Date of Birth validation
    transaction.dateOfTransaction = transaction.dateOfTransaction.trim();
    if (transaction.dateOfTransaction.length == 0 ) throw Error("Date of Transaction field mandatory");
    if (!/^\d{1,2}.\d{1,2}.\d{4}$/.test(transaction.dateOfTransaction)) throw Error("Date of Transaction field format 'dd/mm/yyyy' or 'dd.mm.yyyy'");
    const [day, month,  year] = transaction.dateOfTransaction.split('.');
    transaction.dateOfTransaction = new Date(year, month - 1, day);

    return transaction;
}


module.exports = router;