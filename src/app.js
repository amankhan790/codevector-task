import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productRouter from "./routes/product.route.js";
import healthRouter from "./routes/health.route.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use(healthRouter);
app.use("/api", productRouter);

export default app;
