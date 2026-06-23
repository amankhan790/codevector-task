import mongoose from "mongoose";
import ProductModel from "../model/product.model.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const decodeCursor = (cursor) => {
  try {
    const decoded = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    );

    if (!decoded.updatedAt || !decoded.id) return null;

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) return null;

    return {
      updatedAt: new Date(decoded.updatedAt),
      id: new mongoose.Types.ObjectId(decoded.id),
    };
  } catch {
    return null;
  }
};

const encodeCursor = (product) => {
  const payload = JSON.stringify({
    updatedAt: product.updatedAt.toISOString(),
    id: product._id.toString(),
  });
  return Buffer.from(payload).toString("base64url");
};

const getProducts = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );
    const { category, cursor } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (!decoded) {
        return res.status(400).json({ error: "Invalid cursor" });
      }

      // Cursor pagination: stable sort key (updatedAt, _id) newest first.
      // New inserts/updates at the top do not shift pages the user already saw.
      filter.$or = [
        { updatedAt: { $lt: decoded.updatedAt } },
        { updatedAt: decoded.updatedAt, _id: { $lt: decoded.id } },
      ];
    }

    const products = await ProductModel.find(filter)
      .sort({ updatedAt: -1, _id: -1 })
      .limit(limit + 1)
      .select("name category price createdAt updatedAt")
      .lean();

    const hasMore = products.length > limit;
    if (hasMore) {
      products.pop();
    }

    const nextCursor =
      hasMore && products.length > 0
        ? encodeCursor(products[products.length - 1])
        : null;

    return res.json({
      products,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default { getProducts };
