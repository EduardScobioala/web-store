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

    static async saveCustomer(customer) {
        const db = new DBManager;

        const sql = "INSERT INTO customer (cardNumber, lastName, firstName, dateOfBirth) VALUES (?, ?, ?, ?)";
        const params = [customer.cardNumber, customer.lastName, customer.firstName, customer.dateOfBirth];

        return await db.runQuery(sql, params);
    }
}

module.exports = Customer;