import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

import ProductModel from "./model/product.model.js";
import connectDB from "./db/db.js";

const categories = ["Electronics", "Books", "Clothing", "Sports", "Home"];

const BATCH_SIZE = 5000;  // Insert 5,000 products at a time in batches
const TOTAL_TO_INSERT = 200000; // 200,000 products

async function seedProducts() {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB is not connected");
    }

    const startIndex = await ProductModel.countDocuments();

    if (startIndex > 0) {
      console.log(
        `Found ${startIndex} existing products. Continuing from Product ${startIndex + 1}`,
      );
    }

    for (let i = 0; i < TOTAL_TO_INSERT; i += BATCH_SIZE) {
      const products = [];
      const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_TO_INSERT - i);

      for (let j = 0; j < currentBatchSize; j++) {
        products.push({
          name: `Product ${startIndex + i + j + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          price: Math.floor(Math.random() * 10000) + 100,
        });
      }

      await ProductModel.insertMany(products);

      console.log(
        `Inserted ${startIndex + Math.min(i + currentBatchSize, TOTAL_TO_INSERT)} products total`,
      );
    }

    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();
