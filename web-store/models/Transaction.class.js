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

    static async getTransactionsByPerson(searchOptions) {
        const db = new DBManager;

        let sql, params;
        if (searchOptions.name) {
            sql = "SELECT cardNumber FROM customer WHERE upper(lastName) = upper(?) AND upper(firstName) = upper(?)";
            let [ lastName, firstName ] = searchOptions.name.split(" ");
            params = [lastName, firstName];
            
            const cardNumber = (await db.runQuery(sql, params))[0].cardNumber;

            sql = `SELECT product.name, product.price, transaction.quantity FROM transaction
                    LEFT JOIN product ON transaction.productId = product.productId
                    WHERE transaction.cardNumber = ?`;
            params = [cardNumber];

            const result = await db.runQuery(sql, params);

            return result.map(item => ({
                productName: item.name,
                quantity: item.quantity,
                totalValue: item.quantity * item.price
            }));
        } else {
            return [];
        }
    }

    static async getProductsWithActiveWarranty() {
        const db = new DBManager;

        const sql = `SELECT product.name, product.warranty, transaction.dateOfTransaction FROM transaction
            LEFT JOIN product ON transaction.productId = product.productId`;
        const params = [];

        const result = await db.runQuery(sql, params);
        
        return result.map(item => ({
                        productName : item.name,
                        expirationDate : Transaction.getDate(...item.dateOfTransaction.split('.').map(s => parseInt(s)), parseInt(item.warranty))}))
                     .filter(item => new Date() <= item.expirationDate)
                     .map(item => (item.expirationDate = `${item.expirationDate.getDate()}.${item.expirationDate.getMonth()+1}.${item.expirationDate.getFullYear()}`, item));
    }

    static getDate(day, month, year, warranty) {
        return new Date(year + warranty, month - 1, day);
    }

    static async getMostSoldProduct() {
        const db = new DBManager;

        const sql = `SELECT product.name, sum(transaction.quantity) as total FROM transaction
            LEFT JOIN product ON transaction.productId = product.productId
            GROUP BY transaction.productId
            ORDER BY total DESC`;
        const params = [];

        const { name, total } =  (await db.runQuery(sql, params))[0];
        return { name, total };
    }

    static async getMostTransactionsDay() {
        const db = new DBManager;

        const sql = `SELECT dateOfTransaction, sum(quantity) as total FROM transaction
            GROUP BY dateOfTransaction
            ORDER BY count(*) DESC`;
        const params = [];

        const { dateOfTransaction, total } =  (await db.runQuery(sql, params))[0];
        return { dateOfTransaction, total };
    }

    static async getMostActiveCustomer() {
        const db = new DBManager;

        let sql = `SELECT transaction.cardNumber, sum(product.price * transaction.quantity) as total FROM transaction
            LEFT JOIN product ON transaction.productId = product.productId
            GROUP BY transaction.cardNumber
            ORDER BY sum(transaction.quantity) DESC`;
        let params = [];

        const result1 = (await db.runQuery(sql, params))[0];

        sql = `SELECT lastName, firstName FROM customer WHERE cardNumber = ?`;
        params = [result1.cardNumber];

        const result2 = (await db.runQuery(sql, params))[0];

        const { total } = result1;
        const { lastName, firstName } = result2;
        return { lastName, firstName, total };
    }
}

module.exports = Transaction;