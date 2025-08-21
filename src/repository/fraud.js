// services/fraud.js
import { queryDb } from "../utils/query.js";

class FraudRepository {
    /**
     * Save (upsert) a fraud flag.
     */
    async saveFlag(
        transaction_id,
        user_id,
        amount,
        location,
        timestamp,
        violated_rules
    ) {

        const sql = `
      INSERT INTO frauds (
        transaction_id, user_id, amount, location, timestamp, violated_rules
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(transaction_id) DO UPDATE SET
        user_id        = excluded.user_id,
        amount         = excluded.amount,
        location       = excluded.location,
        timestamp      = excluded.timestamp,
        violated_rules = excluded.violated_rules,
        updated_at     = STRFTIME('%Y-%m-%dT%H:%M:%fZ','now')
      `;

        const params = [
            transaction_id,
            user_id,
            amount,
            location,
            timestamp,
            violated_rules
        ];

        return queryDb("insert", sql, params);
    }

    /** Get all fraud flags (newest first) */
    async getAllFlags() {
        const sql = `
        SELECT
            transaction_id AS transactionId,
            user_id        AS userId,
            amount,
            location,
            timestamp,
            violated_rules AS violatedRules,
            created_at     AS createdAt,
            updated_at     AS updatedAt
        FROM frauds
        ORDER BY id DESC
        `;
        return queryDb("all", sql, []);
    }

    /** Get fraud flags for a specific user (newest first) */
    async getFlagsByUser(user_id) {
        const sql = `
        SELECT
            transaction_id AS transactionId,
            user_id        AS userId,
            amount,
            location,
            timestamp,
            violated_rules AS violatedRules,
            created_at     AS createdAt,
            updated_at     AS updatedAt
        FROM frauds
        WHERE user_id = ?
        ORDER BY id DESC
        `;
        return queryDb("all", sql, [user_id]);
    }
}

export const fraudRepository = new FraudRepository();
