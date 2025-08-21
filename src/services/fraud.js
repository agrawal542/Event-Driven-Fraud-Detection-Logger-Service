// service/fraud.js
import { fraudRepository } from "../repository/fraud.js";
import { evaluateFraudRules } from "../utils/fraudRules.js";

class FraudService {
    /**
     * Normalize and validate payload, then upsert.
     */
    async insertFlag(payload = {}) {
        const {
            transactionId,
            userId,
            amount,
            location,
            timestamp
        } = payload;

        const txId = String(transactionId);
        const uId = String(userId);
        const amt = Number(amount);
        const loc = String(location || "");
        const ts = timestamp ? String(timestamp) : new Date().toISOString();

        // recent transactions for rule check
        const recent = await fraudRepository.getFlagsByUser(uId);

        // evaluate rules (just pass necessary params)
        const violatedRules = evaluateFraudRules({
            amount: amt,
            location: loc,
            timestamp: ts,
            recentTransactions: recent
        });

        const vrStr = JSON.stringify(violatedRules);

        return fraudRepository.saveFlag(txId, uId, amt, loc, ts, vrStr);
    }

    async getAllFlags() {
        return fraudRepository.getAllFlags();
    }

    async getFlagsByUser(userId) {
        return fraudRepository.getFlagsByUser(userId);
    }
}

export const fraudService = new FraudService();
