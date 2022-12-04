const express = require("express");
const router = express.Router();
const Product = require("../models/Product.class");

// All Product route
router.get("/", async (req, res) => {
    const searchOptions = {};
    if (req.query.productName != null && req.query.productName !== "") {
        searchOptions.productName = new RegExp(req.query.product.trim(), "i");
    }
    try {
        const products = await Product.getProducts(searchOptions);
        
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
    const rawProduct = {
        productId : req.body.productId,
        productName : req.body.productName,
        warranty : req.body.warranty,
        stock : req.body.stock,
        price : req.body.price
    };

    let product;
    try {
        product = new Product(_dataValidation(rawProduct));
        const newProduct = await product.save();
        res.redirect("products");
    } catch(error) {
        console.log(error)
        res.render("products/new", {
            product : rawProduct,
            errorMessage : error.message
        });
    }
});

function _dataValidation(product) {
    // Product ID validation
    product.productId = product.productId.trim();
    if (product.productId.length == 0 ) throw Error("Product ID field mandatory");
    if (product.productId.length != 8) throw Error("Product ID field must be of 8 characters");
    if (!/^[a-zA-Z0-9]+$/.test(product.productId)) throw Error("Product ID field can be made out of only digits or letters");

    // Product Name validation
    product.productName = product.productName.trim();
    if (product.productName.length == 0 ) throw Error("Product Name field mandatory");
    if (product.productName.length > 30) throw Error("Product Name field must not exceed 30 characters");
    if (!/^[a-zA-Z0-9-]+$/.test(product.productName)) throw Error("Product Name field can be made out of only letters");

    // Warranty validation
    if ((product.warranty.trim()).length == 0 ) throw Error("Warranty field mandatory");
    if (!/^[0-9]+$/.test(product.warranty)) throw Error("Warranty field can be made out of only digits");
    product.warranty = parseInt(product.warranty);
    if (product.warranty > 5) throw Error("Warranty cannot be bigger than 5 years");

    // Stock validation
    if ((product.stock.trim()).length == 0 ) throw Error("Stock field mandatory");
    if (!/^[0-9]+$/.test(product.stock)) throw Error("Stock field can be made out of only digits");
    product.stock = parseInt(product.stock);
    if (product.stock > 200) throw Error("Stock cannot be bigger than 200");

    // Price validation
    product.price = product.price.trim();
    if (product.price.length == 0 ) throw Error("Price field mandatory");
    if (!/^[+-]?\d+(\.\d+)?$/.test(product.price)) throw Error("Price field can be made out of only digits, format 'n' or 'n.zz'");

    return product;
}


module.exports = router;