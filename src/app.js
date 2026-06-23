import express from "express";
import productRouter from "./routes/product.route.js";

const app = express();

app.use(express.json());

app.use("/api", productRouter);

export default app;
