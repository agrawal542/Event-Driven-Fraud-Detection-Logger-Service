// server.js
import express from "express";
import { serverConfig } from "./config/index.js";
import router from "./routes/index.js";
import { sendTransactions } from "./kafka/producer/transaction.js";
import { startTransactionConsumer } from "./kafka/consumer/transaction.js";
import { initFraudTable } from "./models/fraud.js";
import logger from "./config/logger_config.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const PORT = serverConfig?.PORT || 3001;

app.use(express.json());

// Routes
app.use("/api", router);

// Error handler (after routes)
app.use(errorHandler);

async function start() {
    try {
        // Init DB / consumer first
        await initFraudTable();
        await startTransactionConsumer();

        // Start server first
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);

            // Now trigger background jobs (non-blocking)
            sendTransactions().catch(err =>
                logger.error("Failed to send transactions:", err)
            );
        });

        // Graceful shutdown
        const shutdown = async () => {
            logger.info("Shutting down gracefully...");
            try {
                server.close(() => {
                    logger.info("HTTP server closed.");
                    process.exit(0);
                });
            } catch (err) {
                logger.error("Error during shutdown:", err);
                process.exit(1);
            }
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    } catch (err) {
        logger.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();
