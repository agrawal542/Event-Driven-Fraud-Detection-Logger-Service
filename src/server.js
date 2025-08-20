import express from "express";
import { serverConfig } from "./config/index.js";
import { sendTransactions } from "./kafka/producer/transaction.js";
import { startTransactionConsumer } from "./kafka/consumer/transaction.js";


const app = express();


app.listen(serverConfig.PORT, async () => {
    console.log(`Server is running on ${serverConfig.PORT}`);
    // await startTransactionConsumer();
    // // Run startTransactionConsumer every 3 seconds
    // setInterval(async () => {
    //     try {
    //         await sendTransactions();
    //     } catch (err) {
    //         console.error('Error in consumer interval:', err);
    //     }
    // }, 1000);
});

