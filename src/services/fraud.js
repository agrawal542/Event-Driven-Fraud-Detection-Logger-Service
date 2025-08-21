// service/fraud.js
import logger from "../config/logger_config.js";
import { fraudRepository } from "../repository/fraud.js";
import { evaluateFraudRules } from "../utils/fraudRules.js";

class FraudService {
    /**
     * Normalize and validate payload, then upsert.
     */
    async insertFlag(payload = {}) {
        try {
            const {
                transactionId,
                userId,
                amount,
                location,
                timestamp
            } = payload;

            if (!transactionId || !userId) {
                throw new Error("transactionId and userId are required");
            }

            const txId = String(transactionId).trim();
            const uId = String(userId).trim();
            const amt = Number(amount) || 0;
            const loc = location ? String(location).trim() : "";
            const ts = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

            // recent transactions for rule check
            const recent = await fraudRepository.getFlagsByUser(uId) || [];

            // evaluate rules (just pass necessary params)
            const violatedRules = evaluateFraudRules({
                amount: amt,
                location: loc,
                timestamp: ts,
                recentTransactions: recent
            });

            if (violatedRules?.length > 0) {
                return fraudRepository.saveFlag(
                    txId,
                    uId,
                    amt,
                    loc,
                    ts,
                    JSON.stringify(violatedRules)
                );
            }

            return null; // explicit return
        } catch (err) {
            logger.error("FraudService.insertFlag error:", err);
            throw err; // propagate to controller
        }
    }

    async getAllFlags() {
        return fraudRepository.getAllFlags();
    }

    async getFlagsByUser(userId) {
        if (!userId) throw new Error("userId is required");
        return fraudRepository.getFlagsByUser(String(userId));
    }
}

export const fraudService = new FraudService();
