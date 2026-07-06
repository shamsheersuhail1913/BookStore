import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config();

let isConnected = false;

const startDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

export default async function handler(req, res) {
  try {
    await startDB();
    return app(req, res);
  } catch (error) {
    console.error("❌ Vercel server handler error", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
