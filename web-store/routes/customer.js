const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");

// All Customers route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.lastName != null && req.query.lastName !== "") {
        searchOptions.lastName = new RegExp(req.query.lastName.trim(), "i");
    }
    try {
        const customers = await Customer.find(searchOptions);
        res.render("customers/index", {
            customers : customers,
            searchOptions : req.query
        });
    } catch {
        res.redirect("/");
    }
});

// New Customer route
router.get("/new", (req, res) => {
    res.render("customers/new", { customer: new Customer() });
});

// Create Customer route
router.post("/", async (req, res) => {
    const customer = new Customer({
        cardNumber : req.body.cardNumber,
        lastName : req.body.lastName,
        firstName : req.body.firstName,
        dateOfBirth : Date(req.body.dateOfBirth)
    });

    try {
        const newCustomer = await customer.save();
        res.redirect("customers");
    } catch {
        res.render("customers/new", {
            customer : customer,
            errorMessage : "Error creating Customer"
        });
    }
});


module.exports = router;