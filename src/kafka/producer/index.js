import { getKafkaClient } from '../index.js';

let producer;

export async function getProducer() {
    try {
        if (!producer) {
            const kafka = getKafkaClient();
            producer = kafka.producer({
                allowAutoTopicCreation: false,
                retry: { retries: 2 },
            });

            await producer.connect();
            console.log('Producer connected');
        }
        return producer;
    } catch (err) {
        console.error('Producer connection error:', err);
    }
}

export async function sendMessage(topic, messages) {
    try {
        const prod = await getProducer();
        if (!prod) return;

        await prod.send({ topic, messages });
        console.log(`Message sent to ${topic}`);
    } catch (err) {
        console.error('Send message error:', err);
    }
}

export async function shutdownProducer() {
    try {
        if (producer) {
            await producer.disconnect();
            console.log('Producer disconnected');
        }
    } catch (err) {
        console.error('Producer disconnect error:', err);
    }
}
