import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

let isConnected = false;

export default async function handler(req, res) {
    if (!isConnected) {
        await connectdb();
        isConnected = true;
    }

    return app(req, res);
}
