import { getKafkaClient } from '../index.js';

let consumer;

export async function getConsumer(groupId) {
    try {
        if (!consumer) {
            const kafka = getKafkaClient();
            consumer = kafka.consumer({ groupId });
            await consumer.connect();
            console.log('Consumer connected');
        }
        return consumer;
    } catch (err) {
        console.error('Error connecting consumer:', err);
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
                    console.error('Handler error:', err);
                }
            },
        });

        console.log(`Subscribed to ${topic}`);
    } catch (err) {
        console.error('Subscribe error:', err);
    }
}

export async function shutdownConsumer() {
    try {
        if (consumer) {
            await consumer.disconnect();
            console.log('Consumer disconnected');
        }
    } catch (err) {
        console.error('Error disconnecting consumer:', err);
    }
}
