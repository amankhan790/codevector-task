import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import ProductModel from "../src/model/product.model.js";
import connectDB from "../src/db/db.js";

const categories = ["Electronics", "Books", "Clothing", "Sports", "Home"];

async function seedProducts() {
  try {
    await connectDB();

    const BATCH_SIZE = 5000;
    const TOTAL_PRODUCTS = 200000;

    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
      const products = [];
      const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_PRODUCTS - i);

      for (let j = 0; j < currentBatchSize; j++) {
        products.push({
          name: `Product ${i + j + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          price: Math.floor(Math.random() * 10000) + 100,
        });
      }

      await ProductModel.insertMany(products);

      console.log(
        `Inserted ${Math.min(i + currentBatchSize, TOTAL_PRODUCTS)} products`,
      );
    }

    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();
