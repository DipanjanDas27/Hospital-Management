import connectdb from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

export default async function handler(req, res) {
    await connectdb();   // ensures DB is connected once
    return app(req, res);
}
