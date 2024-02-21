import { Schema, model } from "mongoose";
import { string } from "zod";

const userCollection = "Users";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
  isGithub: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection: Date,
  tokenStatus: String,
  resetToken: String,
  resetTokenExpiration: Date,
  tokenExpirationClosure: Date,
});

export const usersModel = model(userCollection, userSchema);
