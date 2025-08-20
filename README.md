# Event-Driven Fraud Detection Logger Service

## Project Setup

1. **Initialize the project**
   ```bash
   npm init -y
   ```

2. **Install dependencies**
   ```bash
   npm install express
   ```

3. **Install development dependencies**
   ```bash
   npm install --save-dev dotenv nodemon
   ```

4. **Update `package.json`**
   - Change the project type to **module**
     ```json
     "type": "module"
     ```
   - Add the dev script
     ```json
     "scripts": {
       "dev": "nodemon index.js"
     }
     ```

5. ✅ This setup allows you to use **ES6 syntax** in the project.

---

## How to Run

Start the development server:
```bash
npm run dev
```

---

# Kafka Setup

1. **Install development dependencies**
   ```bash
   npm install kafkajs
   ```

2. **Download Apache Kafka** from [Kafka Downloads](https://kafka.apache.org/downloads) and extract the files.

3. **Navigate to the extracted Kafka folder** in your terminal.

4. **Start the Kafka server:**
   ```bash
   # Generate a cluster ID
   KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"

   # Ensure the config folder exists
   mkdir -p config

   # Format storage with the cluster ID
   bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/server.properties

   # Start the Kafka server
   bin/kafka-server-start.sh config/server.properties
   ```

6. **Create a Kafka topic for transactions:**
   ```bash
   bin/kafka-topics.sh --create \
     --topic transactions-topic \
     --bootstrap-server localhost:9092 \
     --partitions 3 \
     --replication-factor 1
   ```
