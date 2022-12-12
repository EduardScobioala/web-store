const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction.class");

// All Transactions route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.productId != null && req.query.productId !== "") {
        searchOptions.productId = req.query.productId.trim();
    }
    try {
        const transactions = await Transaction.getTransactions(searchOptions);

        res.render("transactions/index", {
            transactions : transactions,
            searchOptions : searchOptions
        });
    } catch {
        res.redirect("/");
    }
});

// New Transaction route
router.get("/new", async (req, res) => {
    const cardNumbers = await Transaction.getCardNumbers();
    const productIds = await Transaction.getProductId();
    const transaction = {
        cardNumber: "",
        productId: "",
        quantity: "",
        dateOfTransaction: ""
    }

    res.render("transactions/new", { cardNumbers, productIds, transaction });
});

// Create Transaction route
router.post("/", async (req, res) => {
    const rawTransaction = {
        cardNumber : req.body.cardNumber,
        productId : req.body.productId,
        quantity : req.body.quantity,
        dateOfTransaction : req.body.dateOfTransaction
    };
    const cardNumbers = await Transaction.getCardNumbers();
    const productIds = await Transaction.getProductId();

    let transaction;
    try {
        transaction = _dataValidation(rawTransaction);
        await Transaction.saveTransaction(transaction);

        res.redirect("transactions");
    } catch(error) {
        rawTransaction.dateOfTransaction = "";
        res.render("transactions/new", {
            cardNumbers: cardNumbers,
            productIds: productIds,
            transaction: rawTransaction,
            errorMessage: error.message
        });
    }
});

router.get("/person", async (req, res) => {
    const searchOptions = {};
    if (req.query.name != null && req.query.name !== "") {
        searchOptions.name = req.query.name.trim();
    }
    try {
        const transactions = await Transaction.getTransactionsByPerson(searchOptions);

        res.render("statistics/transactionsByPerson", {
            transactions : transactions,
            searchOptions : searchOptions
        });
    } catch(error) {
        res.redirect("/");
    }
});

router.get("/warranty", async (req, res) => {
    try {
        const products = await Transaction.getProductsWithActiveWarranty();

        res.render("statistics/activeWarranty", {
            products : products
        });
    } catch(error) {
        console.log(error.message);
        res.redirect("/");
    }
});

router.get("/quantity", async (req, res) => {
    try {
        const products = await Transaction.getMostSoldProduct();
        console.log(products);

        res.render("statistics/mostSoldProduct", { products });
    } catch(error) {
        console.log(error.message);
        res.redirect("/");
    }
});

router.get("/mostTransactions", async (req, res) => {
    try {
        const products = await Transaction.getMostTransactionsDay();

        res.render("statistics/mostTransactionsDay", { products });
    } catch(error) {
        console.log(error.message);
        res.redirect("/");
    }
});

router.get("/mostActiveCustomer", async (req, res) => {
    try {
        const customer = await Transaction.getMostActiveCustomer();

        res.render("statistics/mostActiveCustomer", { customer });
    } catch(error) {
        console.log(error.message);
        res.redirect("/");
    }
});

function _dataValidation(transaction) {
    // Quantity validation
    if ((transaction.quantity.trim()).length == 0 ) throw Error("Quantity field mandatory");
    if (!/^[0-9]+$/.test(transaction.quantity)) throw Error("Quantity field can be made out of only digits");
    transaction.quantity = parseInt(transaction.quantity);
    if (transaction.quantity > 200) throw Error("Quantity cannot be bigger than 200");

    // Date of Birth validation
    transaction.dateOfTransaction = transaction.dateOfTransaction.trim();
    if (transaction.dateOfTransaction.length == 0 ) throw Error("Date of Transaction field mandatory");
    if (!/^\d{1,2}.\d{1,2}.\d{4}$/.test(transaction.dateOfTransaction)) throw Error("Date of Transaction field format 'dd/mm/yyyy' or 'dd.mm.yyyy'");

    return transaction;
}


module.exports = router;