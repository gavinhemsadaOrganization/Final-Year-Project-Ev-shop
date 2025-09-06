import 'reflect-metadata';
import app from "./app";
import DB from "./config/DBConnection";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const start = async () => {
  try {
    console.log('Environment check:');
    console.log('PORT:', process.env.PORT);
    console.log('CLIENT_URL:', process.env.GOOGLE_CLIENT_ID);
    await DB();
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

start();
