import { Schema, model } from "mongoose";

const authSchema = new Schema({
    name: { type: String,},
    email: { type: String, required: true, unique: true },
    phone: { type: String,min:10, max:10 },
    username: { type: String, unique: true, min: 4, max: 30 },
    password: { type: String, min: 4, max: 30 },
    image: { type: String },
    role: { type: String },
    authProvider: { type: String, enum: ["local", "google"], default: "local", },
    googleId: { type: String, unique: true, sparse: true }
},
    { timestamps: true }
);

const Auth = model("auths", authSchema, "auths")
export default Auth