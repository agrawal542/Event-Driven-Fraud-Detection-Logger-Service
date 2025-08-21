/**
 * Evaluate fraud rules on a transaction.
 *
 * @param {object} params
 * @param {number} params.amount
 * @param {string} params.location
 * @param {string} params.timestamp  - ISO string
 * @param {Array<object>} params.recentTransactions - recent transactions of same user
 *
 * @returns {string[]} violated rules
 */
export function evaluateFraudRules({ amount, location, timestamp, recentTransactions = [] }) {
    const vr = [];

    // Rule 1: Amount > $5000 and location is not "USA"
    const isNotUSA = (location || "").trim().toUpperCase() !== "USA";
    if (amount > 5000 && isNotUSA) {
        vr.push("HIGH_AMOUNT_NON_US");
    }

    // Rule 2: Multiple transactions from same userId in < 10 seconds
    const nowTs = new Date(timestamp).getTime();
    for (let i = 0; i < Math.min(recentTransactions.length, 5); i++) {
        const r = recentTransactions[i];
        if (!r?.timestamp) continue;
        const prevTs = new Date(r.timestamp).getTime();
        if (Number.isFinite(prevTs) && Math.abs(nowTs - prevTs) < 10_000) {
            vr.push("MULTIPLE_TX_10S");
            break;
        }
    }

    // Rule 3: Amount is a round number divisible by 1000
    if (amount % 1000 === 0) {
        vr.push("ROUND_THOUSAND_AMOUNT");
    }

    return vr;
}
