// services/fraud.js
// General SQLite query helper (insert, update, delete, select)

import { connectToSQLite } from "../db/index.js";

// generic query executor
export async function queryDb(type, sql, params = []) {
    const database = await connectToSQLite()

    return new Promise((resolve, reject) => {
        switch (type.toLowerCase()) {
            case "insert":
            case "update":
            case "delete":
                database.run(sql, params, function (err) {
                    if (err) return reject(err);
                    resolve({ lastID: this.lastID, changes: this.changes });
                });
                break;

            case "get": // single row
                database.get(sql, params, (err, row) => {
                    if (err) return reject(err);
                    resolve(row || null);
                });
                break;

            case "all": // multiple rows
            case "select":
                database.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                });
                break;

            default:
                reject(new Error(`Unsupported query type: ${type}`));
        }
    });
}
