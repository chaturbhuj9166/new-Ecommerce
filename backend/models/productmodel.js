import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },

    // ✅ MULTIPLE IMAGES
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
