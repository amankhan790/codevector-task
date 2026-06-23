import dns from "dns";
import mongoose from "mongoose";

// Windows/local DNS often fails SRV lookups for mongodb+srv URIs.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
