const DBManager = require("./DBManager.class");

class Product {
    static async getProducts(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.name) {
            sql = "SELECT * FROM product WHERE upper(name) LIKE ?";
            params = [`${searchOptions.name.toUpperCase()}%`];
        }
        else {
            sql = "SELECT * FROM product";
            params = [];
        }

        return await db.runQuery(sql, params);
    }

    static async saveProduct(product) {
        const db = new DBManager;

        const sql = "INSERT INTO product (productId, name, warranty, stock, price) VALUES (?, ?, ?, ?, ?)";
        const params = [product.productId, product.name, product.warranty, product.stock, product.price];

        return await db.runQuery(sql, params);
    }
}

module.exports = Product;