const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: "String", unique: true },
    password: { type: "String" },
    googleId: { type: "String" },
    thumbnail: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;