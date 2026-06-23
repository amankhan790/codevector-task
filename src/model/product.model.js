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
    },
  },
  {
    timestamps: true,
  },
);

// Important for pagination
productSchema.index({
  category: 1,
  updatedAt: -1,
  _id: -1,
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
