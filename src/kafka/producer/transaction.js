import fs from 'fs';
import { sendMessage } from './index.js';

const topic = 'transactions-topic';
const filePath = '/Users/gautam/Desktop/practice/Event-Driven-Fraud-Detection-Logger-Service/src/kafka/data.json';

export async function sendTransactions() {
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const allTransactions = JSON.parse(raw);

        // Pick up to 5 random transactions
        const transactionsToSend = allTransactions.sort(() => 0.5 - Math.random()).slice(0, 5);

        const kafkaMessages = transactionsToSend.map(msg => ({
            key: msg.transactionId,
            value: JSON.stringify(msg)
        }));

        await sendMessage(topic, kafkaMessages);
        console.log(`${transactionsToSend.length} txn(s) sent to ${topic}`);
    } catch (err) {
        console.error('Send transactions error:', err);
    }
}
