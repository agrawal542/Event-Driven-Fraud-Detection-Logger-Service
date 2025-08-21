import { Kafka } from 'kafkajs'
import { serverConfig } from '../config/index.js';
import logger from '../config/logger_config.js'


function connectToKafka() {
    try {
        let connection;

        serverConfig

        const kafkaConfig = {
            clientId: serverConfig.KAFKA_CLIENT_ID,
            brokers: [serverConfig.KAFKA_BROKER_1],
        }

        return () => {
            if (!connection) {
                connection = new Kafka(kafkaConfig)
            }

            return connection;
        }
    } catch (error) {
        logger.error('Kafka connect Error sending message:', err);
    }
}


export const getKafkaClient = connectToKafka()