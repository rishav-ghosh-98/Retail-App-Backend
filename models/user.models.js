const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: String,

  email: String,

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  cart: [

    {
      product: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Product"

      },

      quantity: {

        type: Number,

        default: 1

      }

    }

  ],

  addresses: [

    {

      fullName: String,

      street: String,

      city: String,

      state: String,

      postalCode: String,

      country: String

    }

  ]

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);