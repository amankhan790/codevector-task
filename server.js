import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

connectDB();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
