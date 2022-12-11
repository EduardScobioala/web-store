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

        let sql = "SELECT stock FROM product WHERE productId = ?";
        let params = [transaction.productId];

        const quantity = await db.runQuery(sql, params);
        
        if (transaction.quantity <= quantity[0].stock) {
            sql = "INSERT INTO transaction (cardNumber, productId, quantity, dateOfTransaction) VALUES (?, ?, ?, ?)";
            params = [transaction.cardNumber, transaction.productId, transaction.quantity, transaction.dateOfTransaction];
            return await db.runQuery(sql, params);
        } else {
            throw new Error(`The stock is limited to a maximum of ${quantity[0].stock} units.`)
        }
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