import { fraudService } from '../../services/fraud.js';
import { subscribeAndConsume } from './index.js';

const topic = 'transactions-topic';
const groupId = 'transactions-group';

export async function startTransactionConsumer() {
    try {
        await subscribeAndConsume(topic, groupId, async ({ key, value }) => {
            try {
                const transaction = JSON.parse(value);
                console.log(`Received txn ${key}:`, transaction);

                // Insert transaction flag into fraud service
                await fraudService.insertFlag({
                    transactionId: transaction.id || key,
                    userId: transaction.userId,
                    amount: transaction.amount,
                    location: transaction.location,
                    timestamp: transaction.timestamp,
                });

                // Add your processing logic here
                // e.g., fraud detection, saving to DB, etc.
            } catch (err) {
                console.error('Transaction processing error:', err);
            }
        });

        console.log('Consumer started for topic:', topic);
    } catch (err) {
        console.error('Consumer start error:', err);
    }
}
