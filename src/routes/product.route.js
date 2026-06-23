import express from "express";
import productController from "../controller/product.controller.js";

const productRouter = express.Router();

productRouter.get("/products", productController.getProducts);

export default productRouter;
