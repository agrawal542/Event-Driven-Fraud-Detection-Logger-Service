// models/fraud.js
import { connectToSQLite } from "../db/index.js";

function runAsync(database, sql, params = []) {
    return new Promise((resolve, reject) => {
        database.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

export async function initFraudTable() {
    const database = await connectToSQLite();

    await runAsync(
        database,
        `CREATE TABLE IF NOT EXISTS frauds (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id  TEXT    NOT NULL UNIQUE,
        user_id         TEXT    NOT NULL,
        amount          REAL    NOT NULL,
        location        TEXT,
        timestamp       TEXT    NOT NULL,  -- ISO8601
        violated_rules  TEXT    NOT NULL DEFAULT '[]', -- JSON array of rule codes
        created_at      TEXT    NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ','now')),
        updated_at      TEXT    NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ','now'))
        );
        `
    );

    await runAsync(
        database,
        `CREATE INDEX IF NOT EXISTS idx_frauds_user_id ON frauds (user_id);`
    );
}
