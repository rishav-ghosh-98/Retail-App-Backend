const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const { initialiseDatabase } = require("./db/db.connect");
const fs = require("fs");
const Product = require("./models/products.models");
const Category = require("./models/category.models");
const User = require("./models/user.models");
const express = require("express");
const app = express();
const jsonData = fs.readFileSync("products.json", "utf-8");
const ProductsData = JSON.parse(jsonData);
initialiseDatabase();
app.use(express.json());
const PORT = 5000;
// const seedData = async () => {
//     try{
//         for(const prodData of ProductsData) {
//             const newProd = new Product({
//                 title: prodData.title,
//                 description: prodData.description,
//                 category: prodData.category,
//                 price: prodData.price,
//                 stock: prodData.stock,
//                 image: prodData.image,
//                 rating: prodData.rating,
//                 numReviews: prodData.numReviews
//             })
//             console.log(newProd)
//             await newProd.save()
//         }
//         console.log("Data seeding completed successfully!")

//     }catch(error){
//         console.log("Error in seeding data", error)
//     }
// }

// seedData();

// const seedCategories = async () => {
//     try {
//         const categories = [
//             {
//                 name: "electronics",
//                 description: "Electronic devices and gadgets",
//                 image: "electronics.avif"
//             },
//             {
//                 name: "fashion",
//                 description: "Clothing and fashion items",
//                 image: "fashion.avif"
//             },
//             {
//                 name: "accessories",
//                 description: "Accessories and add-ons",
//                 image: "accessories.avif"
//             },
//             {
//                 name: "health",
//                 description: "Health and wellness products",
//                 image: "health.avif"
//             },
//             {
//                 name: "home",
//                 description: "Home and living products",
//                 image: "home.avif"
//             }
//         ];

//         for (const catData of categories) {
//             const newCategory = new Category({
//                 name: catData.name,
//                 description: catData.description,
//                 image: catData.image
//             });
//             console.log(newCategory);
//             await newCategory.save();
//         }
//         console.log("Category seeding completed successfully!");
//     } catch (error) {
//         console.log("Error in seeding categories", error);
//     }
// };

// seedCategories();
const seedUser = async () => {
  try {
    const userData = {
      name: "John Doe",
      email: "john@example1.com",
      wishlist: [],
      cart: [],
      addresses: [
        {
          fullName: "John Mary",
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA"
        }
      ]
    };

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log("User already exists with this email");
      return;
    }

    const newUser = new User(userData);
    await newUser.save();
    console.log("✅ User seeded successfully!");
  } catch (error) {
    console.log("❌ Error seeding user:", error);
  }
};


seedUser();

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
    console.log(productId);
    return await Product.findById(productId);
  } catch (error) {
    console.log("Error in getting products by Id", error);
    throw error;
  }
};
app.get("/products/:productId", async (req, res) => {
  try {
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
console.log("Categories route loaded");
app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      data: {
        categories: categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching categories",
    });
  }
});
const getCategoryById = async (categoryId) => {
  try {
    console.log(categoryId);
    return await Category.findById(categoryId);
  } catch (error) {
    console.log("Error in getting Category by Id", error);
    throw error;
  }
};
app.get("/categories/:categoryId", async (req, res) => {
  try {
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
    const userId = req.params.userId;

    const user = await getWishlistByUserId(userId);

    if (user) {
      res.status(200).json({
        data: {
          wishlist: user.wishlist,
        },
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error fetching wishlist",
    });
  }
});

const addProductToWishlist = async (userId, productId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return null;
    }

    // avoid duplicate entries
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
    const userId = req.params.userId;

    const productId = req.body.productId;

    const updatedUser = await addProductToWishlist(
      userId,

      productId,
    );

    if (updatedUser) {
      res.status(200).json({
        message: "Product added to wishlist",

        data: {
          wishlist: updatedUser.wishlist,
        },
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error adding product to wishlist",
    });
  }
});
const removeProductFromWishlist = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    return await user.save();
  } catch (error) {
    console.log("Error removing product from wishlist", error);

    throw error;
  }
};
app.delete("/wishlist/:userId/:productId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const productId = req.params.productId;

    const updatedUser = await removeProductFromWishlist(
      userId,

      productId,
    );
    if (updatedUser) {
      res.status(200).json({
        message: "Product removed from wishlist",

        data: {
          wishlist: updatedUser.wishlist,
        },
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error removing product from wishlist",
    });
  }
});
