
import dotenv from 'dotenv'

dotenv.config()

const serverConfig = {
    PORT: process.env.PORT,
    KAFKA_BROKER_1: process.env.KAFKA_BROKER_1,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
}

export {
    serverConfig
}
