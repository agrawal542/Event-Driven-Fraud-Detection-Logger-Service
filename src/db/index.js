import sqlite3 from 'sqlite3';
import logger from '../config/logger_config.js';

const dbPath = '/Users/gautam/Desktop/practice/Event-Driven-Fraud-Detection-Logger-Service/src/db/test.sqlite';

sqlite3.verbose();

async function connectToSQLite() {
    try {
        return await new Promise((resolve, reject) => {
            const connection = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    logger.error('SQLite connection error:', err.message);
                    reject(err);
                } else {
                    logger.info(`Connected to SQLite at ${dbPath}`);
                    resolve(connection);
                }
            });
        });
    } catch (error) {
        logger.error('SQLite connect error:', error);
    }
}

export { connectToSQLite };
