const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// All Product route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.product != null && req.query.product !== "") {
        searchOptions.product = new RegExp(req.query.product.trim(), "i");
    }
    try {
        const products = await Product.find(searchOptions);
        res.render("products/index", {
            products : products,
            searchOptions : req.query
        });
    } catch {
        res.redirect("/");
    }
});

// New Product route
router.get("/new", (req, res) => {
    res.render("products/new", { product: new Product() });
});

// Create Product route
router.post("/", async (req, res) => {
    const product = new Product({
        productId : req.body.productId,
        product : req.body.product,
        warranty : parseInt(req.body.warranty),
        stock : parseInt(req.body.stock),
        price : parseFloat(req.body.price)
    });

    try {
        const newProduct = await product.save();
        res.redirect("products");
    } catch(error) {
        console.log(error)
        res.render("products/new", {
            product : product,
            errorMessage : "Error creating Product"
        });
    }
});


module.exports = router;