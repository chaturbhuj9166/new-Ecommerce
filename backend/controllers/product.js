import Product from "../models/Productmodel.js";

/* ===== ADD PRODUCT ===== */
export async function addProduct(req, res) {
  try {
    console.log("FILES COUNT:", req.files?.length);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image required" });
    }

    const images = req.files.map(
      (file) => `uploads/${file.filename}`
    );

    const product = new Product({
      ...req.body,
      images,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
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
  const updatedData = { ...req.body };

  if (req.files && req.files.length > 0) {
    updatedData.images = req.files.map(
      (file) => `uploads/${file.filename}`
    );
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true }
  );

  res.json(product);
}

/* ===== DELETE ===== */
export async function deleteProduct(req, res) {
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
