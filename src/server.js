// server.js
import express from "express";
import { serverConfig } from "./config/index.js";
import router from "./routes/index.js";
import { sendTransactions } from "./kafka/producer/transaction.js";
import { startTransactionConsumer } from "./kafka/consumer/transaction.js";
import { initFraudTable } from "./models/fraud.js";

const app = express();
const PORT = serverConfig?.PORT || 3001;

app.use(express.json());

// Your API routes
app.use("/api", router);

async function start() {
    try {
        // Init dependencies before accepting traffic
        await initFraudTable();
        await startTransactionConsumer();

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Periodically produce/send transactions (for testing/demo)
        const intervalId = setInterval(async () => {
            try {
                await sendTransactions();
            } catch (err) {
                console.error("Error in sendTransactions interval:", err);
            }
        }, 2000);

        // Graceful shutdown
        const shutdown = () => {
            clearInterval(intervalId);
            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start()