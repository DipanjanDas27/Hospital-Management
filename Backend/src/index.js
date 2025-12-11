import connectdb from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import serverless from "serverless-http"

dotenv.config();

await connectdb(); // Connect DB once

const handler = serverless(app);
export default handler;