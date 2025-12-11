import connectdb from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

// connect DB once
await connectdb();

// export express handler for Vercel
export default app;
