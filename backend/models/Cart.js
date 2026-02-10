import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // name: {type:String,required:true},
    
    quantity: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || model("Cart", cartSchema);
export default Cart;