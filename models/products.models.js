const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["electronics", "fashion", "accessories", "health", "home"],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
    },

    image: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful for filtering
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;