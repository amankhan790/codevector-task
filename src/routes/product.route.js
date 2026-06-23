import express from "express";
import productController from "../controller/product.controller.js";

const productRouter = express.Router();

productRouter.post("/product", productController.createProduct);


export default productRouter;