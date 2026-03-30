const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      lowercase: true,

      enum: [
        "electronics",
        "fashion",
        "accessories",
        "health",
        "home"
      ]
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;