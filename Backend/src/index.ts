import app from "./app";
import DB from "./config/DBConnection";

const PORT = process.env.PORT;
const start = async () => {
  try {
    await DB();
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

start();
