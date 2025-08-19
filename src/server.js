import express from "express";
import { serverConfig } from "./config/index.js";


const app = express();


app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on ${serverConfig.PORT}`)
})

