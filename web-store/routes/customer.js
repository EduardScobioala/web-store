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
    
    let customer = new Customer({
        cardNumber : req.body.cardNumber,
        lastName : req.body.lastName,
        firstName : req.body.firstName,
        dateOfBirth : req.body.dateOfBirth
    });

    try {
        customer = _dataValidation(customer);
        const newCustomer = await customer.save();
        res.redirect("customers");
    } catch(error) {
        console.log(error.message);
        res.render("customers/new", {
            customer : customer,
            errorMessage : error.message
        });
    }
});

function _dataValidation(customer) {
    // Card Number validation
    customer.cardNumber = customer.cardNumber.trim();
    if (customer.cardNumber.length == 0 ) throw Error("Card Number field mandatory");
    if (customer.cardNumber.length != 8) throw Error("Card Number field must be of 8 characters");
    if (!/^\d+$/.test(customer.cardNumber)) throw Error("Card Number field can be made out of only digits");

    // Last Name validation
    customer.lastName = customer.lastName.trim();
    if (customer.lastName.length == 0 ) throw Error("Last Name field mandatory");
    if (customer.lastName.length > 20) throw Error("Last Name field must not exceed 20 characters");
    if (!/^[a-zA-Z]+$/.test(customer.lastName)) throw Error("Last Name field can be made out of only letters");

    // First Name validation
    customer.firstName = customer.firstName.trim();
    if (customer.firstName.length == 0 ) throw Error("First Name field mandatory");
    if (customer.firstName.length > 20) throw Error("First Name field must not exceed 20 characters");
    if (!/^[a-zA-Z]+$/.test(customer.firstName)) throw Error("First Name field can be made out of only letters");

    // Date of Birth validation
    customer.dateOfBirth = customer.dateOfBirth.trim();
    if (customer.dateOfBirth.length == 0 ) throw Error("Date of Birth field mandatory");
    if (!/^\d{1,2}[./]\d{1,2}[./]\d{4}$/.test(customer.dateOfBirth)) throw Error("Date of Birth field format 'dd/mm/yyyy' or 'dd.mm.yyyy'");

    return customer;
}


module.exports = router;