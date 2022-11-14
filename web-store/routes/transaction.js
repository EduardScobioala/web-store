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
    const transaction = new Transaction({
        cardNumber : req.body.cardNumber,
        productId : req.body.productId,
        quantity : parseInt(req.body.quantity),
        dateOfTransaction : req.body.dateOfTransaction
    });

    try {
        const newTransaction = await transaction.save();
        res.redirect("transactions");
    } catch(error) {
        res.render("transactions/new", {
            transaction : transaction,
            errorMessage : "Error creating Transaction"
        });
    }
});


module.exports = router;