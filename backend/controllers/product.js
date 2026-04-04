import Product from "../models/productmodel.js";
import uploadToCloudinary from "../middlewares/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

/* ===== ADD PRODUCT (🔥 YAHI MAIN FIX HAI) ===== */
export async function addProduct(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image required" });
    }

    const images = [];

    for (const file of req.files) {
      const img = await uploadToCloudinary(file);
      images.push(img);
    }

    // 🔥 SAFE DATA HANDLE
    const product = new Product({
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
      description: req.body.description,
      originalPrice: req.body.originalPrice,
      discountedPrice: req.body.discountedPrice,

      // 🔥 SIZE FIX (IMPORTANT)
      sizes: req.body.sizes || [],

      images,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
}

/* ===== GET ALL ===== */
export async function getProduct(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

/* ===== GET BY ID ===== */
export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
}

/* ===== UPDATE ===== */
export async function updateProduct(req, res) {
  try {
    const updatedData = {
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
      description: req.body.description,
      originalPrice: req.body.originalPrice,
      discountedPrice: req.body.discountedPrice,

      // 🔥 UPDATE ME BHI SIZE ADD
      sizes: req.body.sizes || [],
    };

    if (req.files && req.files.length > 0) {
      const images = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      updatedData.images = images;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ===== DELETE ===== */
export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }

  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}

/* ===== SLUG CHECK ===== */
export async function checkSlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) return res.status(400).json({ message: "Slug exists" });
  res.json({ message: "Slug available" });
}

/* ===== BY SLUG ===== */
export async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
}