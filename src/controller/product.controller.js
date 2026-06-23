import ProductModel from "../model/product.model.js";

const categories = ["Electronics", "Books", "Clothing", "Sports", "Home"];

async function createProduct(req, res) {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res
      .status(400)
      .json({ error: "Name, price, and category are required." });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ error: "Invalid category." });
  }

  try {
    const product = await ProductModel.insertMany({ name, price, category });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export default {
  createProduct,
};
