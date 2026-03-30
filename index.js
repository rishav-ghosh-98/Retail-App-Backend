const { initialiseDatabase } = require("./db/db.connect")
const fs = require("fs");
const Product = require("./models/products.models")
const Category = require("./models/category.models")
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

const getProducts = async() => {
    try{
        return await Product.find()
    }catch(error){
        console.log("error in creating products", error);
        throw error;
    }
}
app.get("/products", async(req,res) => {
    try{
        const products = await getProducts()
    if (products.length > 0) {
      res.status(200).json({ message: "All products fetched", products });
    } else {
      res.status(404).json({ error: "No products found" });
    }
    }catch(error){
        res.status(500).json({ error: "Error fetching products" });
    }
   
})
const getProductsById = async(productId) => {
    try{
        console.log(productId)
         return await Product.findById(productId)
         
    }catch(error){
        console.log("Error in getting products by Id", error)
        throw error;
    }
}
app.get("/products/:productId", async(req,res) => {
    try{
        const productId = req.params.productId
        const product = await getProductsById(productId)
        if(product){
            res.status(200).json(product)
        }else{
            res.status(200).json("Product id not found")
        }
    }catch(error){
        res.status(500).json({error:"Error fetching Product By Id"})
    }
})
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

app.listen(PORT, () => {
  console.log("Successfully connected to port", PORT);
});