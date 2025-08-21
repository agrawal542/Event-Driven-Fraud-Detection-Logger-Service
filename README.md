# Event-Driven Fraud Detection Logger Service

This service consumes transaction events from Kafka, applies fraud detection rules, and exposes APIs to query fraud logs.

## Project Setup

1. Clone the repository and install dependencies:
   git clone <your-repo-url>
   cd Event-Driven-Fraud-Detection-Logger-Service
   npm install

2. Create a `.env` file in the root folder:
   PORT=3001
   KAFKA_BROKER_1=localhost:9092
   KAFKA_CLIENT_ID=fraud-logger-service

3. Start the development server:
   npm run dev

---

# Kafka Setup

1. Install development dependencies:
   npm install kafkajs

2. Download Apache Kafka from https://kafka.apache.org/downloads and extract the files.

3. Navigate to the extracted Kafka folder in your terminal.

4. Start the Kafka server:

   # Generate a cluster ID

   KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"

   # Ensure the config folder exists

   mkdir -p config

   # Format storage with the cluster ID

   bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/server.properties

   # Start the Kafka server

   bin/kafka-server-start.sh config/server.properties

5. Create a Kafka topic for transactions:
   bin/kafka-topics.sh --create \
    --topic transactions-topic \
    --bootstrap-server localhost:9092 \
    --partitions 3 \
    --replication-factor 1

---

## API Endpoints

### Health Check

- GET /api/health  
  Response:  
  {
  "status": "success",
  "message": "API is running"
  }

### Get All Frauds

- GET /api/fraud

### Get Frauds by User ID

- GET /api/fraud/:userId

---

✅ That’s it! Just set `.env`, run `npm install`, start Kafka, and then `npm run dev`.
