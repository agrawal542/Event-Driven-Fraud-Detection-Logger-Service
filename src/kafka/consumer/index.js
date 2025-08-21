import logger from '../../config/logger_config.js';
import { getKafkaClient } from '../index.js';

let consumer;

export async function getConsumer(groupId) {
    try {
        if (!consumer) {
            const kafka = getKafkaClient();
            consumer = kafka.consumer({ groupId });
            await consumer.connect();
            logger.info('Consumer connected');
        }
        return consumer;
    } catch (err) {
        logger.error('Error connecting consumer:', err);
    }
}

export async function subscribeAndConsume(topic, groupId, messageHandler) {
    try {
        const cons = await getConsumer(groupId);
        if (!cons) return;

        await cons.subscribe({ topic, fromBeginning: true });

        await cons.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    await messageHandler({
                        topic,
                        partition,
                        key: message.key?.toString(),
                        value: message.value?.toString(),
                        headers: message.headers,
                    });
                } catch (err) {
                    logger.error('Handler error:', err);
                }
            },
        });

        logger.info(`Subscribed to ${topic}`);
    } catch (err) {
        logger.error('Subscribe error:', err);
    }
}

export async function shutdownConsumer() {
    try {
        if (consumer) {
            await consumer.disconnect();
            logger.info('Consumer disconnected');
        }
    } catch (err) {
        logger.error('Error disconnecting consumer:', err.message);
    }
}
