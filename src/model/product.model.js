import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Supports category-filtered pagination (newest first)
productSchema.index({ category: 1, updatedAt: -1, _id: -1 });

// Supports unfiltered pagination (newest first)
productSchema.index({ updatedAt: -1, _id: -1 });

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
