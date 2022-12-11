const DBManager = require("./DBManager.class");

class Transaction {
    static async getTransactions(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.productId) {
            sql = "SELECT * FROM transaction WHERE upper(productId) LIKE ?";
            params = [`${searchOptions.productId.toUpperCase()}%`];
        }
        else {
            sql = "SELECT * FROM transaction";
            params = [];
        }

        return await db.runQuery(sql, params);
    }

    static async saveTransaction(transaction) {
        const db = new DBManager;

        console.log(transaction.cardNumber, transaction.productId, transaction.quantity, transaction.dateOfTransaction);
        const sql = "INSERT INTO transaction (cardNumber, productId, quantity, dateOfTransaction) VALUES (?, ?, ?, ?)";
        const params = [transaction.cardNumber, transaction.productId, transaction.quantity, transaction.dateOfTransaction];

        return await db.runQuery(sql, params);
    }

    static async getCardNumbers() {
        const db = new DBManager;

        const sql = "SELECT cardNumber FROM customer";
        const params = [];

        return await db.runQuery(sql, params);
    }

    static async getProductId() {
        const db = new DBManager;

        const sql = "SELECT productId FROM product";
        const params = [];

        return await db.runQuery(sql, params);
    }
}

module.exports = Transaction;