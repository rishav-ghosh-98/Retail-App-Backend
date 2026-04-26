const cors = require('cors');
const { initialiseDatabase } = require("./db/db.connect");
const Product = require("./models/products.models");
const Category = require("./models/category.models");
const User = require("./models/user.models");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());
// initialiseDatabase(); commeneted out required only for local use connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Successfully connected to port", PORT);
});

const getProducts = async () => {
  try {
    return await Product.find();
  } catch (error) {
    console.log("error in creating products", error);
    throw error;
  }
};

app.get("/products", async (req, res) => {
  try {
    await initialiseDatabase(); // ✅
    const products = await getProducts();
    if (products.length > 0) {
      res.status(200).json({ message: "All products fetched", products });
    } else {
      res.status(404).json({ error: "No products found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

const getProductsById = async (productId) => {
  try {
    return await Product.findById(productId);
  } catch (error) {
    console.log("Error in getting products by Id", error);
    throw error;
  }
};

app.get("/products/:productId", async (req, res) => {
  try {
    await initialiseDatabase(); // ✅
    const productId = req.params.productId;
    const product = await getProductsById(productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(200).json("Product id not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching Product By Id" });
  }
});

const getAllCategories = async () => {
  try {
    return await Category.find();
  } catch (error) {
    console.log("Error fetching categories", error);
    throw error;
  }
};

app.get("/categories", async (req, res) => {
  try {
    await initialiseDatabase(); // ✅
    const categories = await getAllCategories();
    res.status(200).json({
      data: {
        categories: categories,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
});

const getCategoryById = async (categoryId) => {
  try {
    return await Category.findById(categoryId);
  } catch (error) {
    console.log("Error in getting Category by Id", error);
    throw error;
  }
};

app.get("/categories/:categoryId", async (req, res) => {
  try {
    await initialiseDatabase(); // ✅
    const categoryId = req.params.categoryId;
    const category = await getCategoryById(categoryId);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(200).json("Category id not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching Category By Id" });
  }
});

const getWishlistByUserId = async (userId) => {
  try {
    return await User.findById(userId).populate("wishlist");
  } catch (error) {
    console.log("Error fetching wishlist", error);
  }
};

app.get("/wishlist/:userId", async (req, res) => {
  try {
    await initialiseDatabase(); // ✅
    const userId = req.params.userId;
    const user = await getWishlistByUserId(userId);
    if (user) {
      res.status(200).json({ data: { wishlist: user.wishlist } });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

const addProductToWishlist = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
    }
    return await user.save();
  } catch (error) {
    console.log("Error adding product to wishlist", error);
    throw error;
  }
};

app.post("/wishlist/:userId", async (req, res) => {
  try {
    await initialiseDatabase(); // ✅
    const userId = req.params.userId;
    const productId = req.body.productId;
    const updatedUser = await addProductToWishlist(userId, productId);
    if (updatedUser) {
      res.status(200).json({
        message: "Product added to wishlist",
        data: { wishlist: updatedUser.wishlist },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding product to wishlist" });
  }
});

const removeProductFromWishlist = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    return await user.save();
  } catch (error) {
    console.log("Error removing product from wishlist", error);
    throw error;
  }
};

app.delete("/wishlist/:userId/:productId", async (req, res) => {
  try {
    await initialiseDatabase(); // ✅
    const userId = req.params.userId;
    const productId = req.params.productId;
    const updatedUser = await removeProductFromWishlist(userId, productId);
    if (updatedUser) {
      res.status(200).json({
        message: "Product removed from wishlist",
        data: { wishlist: updatedUser.wishlist },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
});