const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");

// All Customers route
router.get("/", (req, res) => {
    res.render("customers/index");
});

// New Customer route
router.get("/new", (req, res) => {
    res.render("customers/new", { customer: new Customer() });
});

// Create Customer route
router.post("/", (req, res) => {
    const customer = new Customer({
        cardNumber : req.body.cardNumber,
        lastName : req.body.lastName,
        firstName : req.body.firstName,
        dateOfBirth : Date(req.body.dateOfBirth)
    });
    customer.save((err, newCustomer) => {
        if (err) {
            console.log(err);
            res.render("customers/new", {
                customer : customer,
                errorMessage : "Error creating Customer"
            });
        } else {
            console.log("here3");
            res.redirect("customers");
        }
    });
    console.log("here");
});


module.exports = router;