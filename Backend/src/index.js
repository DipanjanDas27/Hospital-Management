import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app } from "./app.js";
import serverlessExpress from "@vendia/serverless-express";

dotenv.config();

let server;

async function initServer() {
  if (!server) {
    console.log("⏳ Connecting to MongoDB...");
    await connectdb();             // Connect only once (NOT on every request)
    console.log("✅ DB Connected!");

    server = serverlessExpress({ app });
  }
  return server;
}

export default async function handler(req, res) {
  const serverInstance = await initServer();
  return serverInstance(req, res);
}
