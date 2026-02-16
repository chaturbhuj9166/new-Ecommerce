import Cart from "../models/Cart.js";

/* ================= ADD / UPDATE CART ================= */
export async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "ProductId and quantity required" });
    }

    const userId = req.user.id; // ✅ FIXED

    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      const newQuantity =
        Number(existingCartItem.quantity) + Number(quantity);

      if (newQuantity <= 0) {
        await Cart.deleteOne({ _id: existingCartItem._id });
        return res.status(200).json({ message: "Product removed from cart" });
      }

      existingCartItem.quantity = String(newQuantity);
      await existingCartItem.save();

      return res.status(200).json({
        message: "Quantity updated",
        product: existingCartItem,
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const productInCart = new Cart({
      userId,
      productId,
      quantity: String(quantity),
    });

    await productInCart.save();

    res.status(201).json({
      message: "Product added to cart",
      product: productInCart,
    });

  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ message: error.message });
  }
}

/* ================= FETCH CART ================= */
export async function fetchCart(req, res) {
  try {
    const cartItems = await Cart.find({
      userId: req.user.id, // ✅ FIXED
    }).populate("productId");

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ message: error.message });
  }
}

/* ================= DELETE CART ITEM ================= */
export async function removeCartItem(req, res) {
  try {
    const cartItemId = req.params.id;

    const deleted = await Cart.findByIdAndDelete(cartItemId);

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Delete Cart Error:", error);
    res.status(500).json({ message: error.message });
  }
}
