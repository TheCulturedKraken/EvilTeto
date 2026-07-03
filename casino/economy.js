const db = require('better-sqlite3')
const Database = new db('casino.db')

Database.prepare('CREATE TABLE IF NOT EXISTS USERS (\nuserId TEXT PRIMARY KEY,\nbalance INTEGER DEFAULT 100)').run();

function ensureUser(userId) {
    Database.prepare('INSERT OR IGNORE INTO users (userId) VALUES (?)').run(userId)
}

function getBalance(userId) {
    let user = Database.prepare('SELECT * FROM users WHERE userId = ?').get(userId)

    if (!user) {
        Database.prepare('INSERT INTO users (userId, balance) VALUES (?,?)').run(userId, 1000);

        return 1000;
    }

    return user.balance;
}

function addMoney(userId, amount) {
    ensureUser(userId)

    Database.prepare('UPDATE users SET balance = balance + ? WHERE userId = ?').run(amount, userId);
}

function takeMoney(userId, amount) {
    Database.prepare('UPDATE users SET balance = balance - ? WHERE userId = ?').run(amount, userId);
}

module.exports = {
    getBalance,
    addMoney,
    takeMoney
}