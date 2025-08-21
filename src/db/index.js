import sqlite3 from 'sqlite3';

const dbPath = '/Users/gautam/Desktop/practice/Event-Driven-Fraud-Detection-Logger-Service/src/db/test.sqlite';

sqlite3.verbose();

async function connectToSQLite() {
    try {
        return await new Promise((resolve, reject) => {
            const connection = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('SQLite connection error:', err.message);
                    reject(err);
                } else {
                    console.log(`Connected to SQLite at ${dbPath}`);
                    resolve(connection);
                }
            });
        });
    } catch (error) {
        console.error('SQLite connect error:', error);
    }
}

export { connectToSQLite };
