const DBManager = require("./DBManager.class");

class Customer {
    static async getCustomers(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.lastName) {
            sql = "SELECT * FROM customer WHERE upper(lastName) LIKE ?";
            params = [`${searchOptions.lastName.toUpperCase()}%`];
        }
        else {
            sql = "SELECT * FROM customer";
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