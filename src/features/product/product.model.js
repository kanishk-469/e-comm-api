import { application } from "express";
import UserModel from "../user/user.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class ProductModel {
  constructor(name, desc, price, imageUrl, category, sizes) {
    this.name = name;
    this.desc = desc;
    this.imageUrl = imageUrl;
    this.price = price;
    this.category = category;
    this.sizes = sizes;
  }

  // static add(product) {
  //   product.id = products.length + 1;
  //   products.push(product);
  //   return product;
  // }
  // static getOneProductById(id) {
  //   return products.find((product) => product.id == id);
  // }
  // static GetAll() {
  //   return products;
  // }

  // static filter(minPrice, maxPrice, category) {
  //   const result = products.filter((product) => {
  //     return (
  //       (!minPrice || product.price >= minPrice) &&
  //       (!maxPrice || product.price <= maxPrice) &&
  //       (!category || product.category == category)
  //     );
  //   });
  //   return result;
  // }

  // static rateProduct(userID, productID, rating) {
  //   // 1. Validate user and product

  //   const user = UserModel.getAll().find((u) => u.id == userID);
  //   if (!user) {
  //     // return "User Not Found";
  //     // throw new Error("User Not Found");

  //     //below we are providing extra details to our error handler
  //     throw new ApplicationError("User Not Found", 404);
  //   }
  //   // Validate product
  //   const product = products.find((p) => p.id == productID);
  //   if (!product) {
  //     // return "Product Not found";
  //     // throw new Error("Product Not Found");

  //     //below we are providing extra details to our error handler
  //     throw new ApplicationError("Product Not Found", 400);
  //   }

  //   /// 2. Check if there are any ratings and if not then add ratings array.
  //   if (!product.rating) {
  //     product.rating = [];
  //     product.rating.push({ userID: userID, rating: rating });
  //   } else {
  //     /// 3.check if user rating is already available
  //     const existingRatingIndex = product.rating.findIndex((r) => {
  //       r.id === userID;
  //     });

  //     if (existingRatingIndex >= 0) {
  //       product.rating[existingRatingIndex] = {
  //         userID: userID,
  //         rating: rating,
  //       };
  //     } else {
  //       // 4. If no existing rating, then add new rating.
  //       product.rating.push({
  //         userID: userID,
  //         rating: rating,
  //       });
  //     }
  //   }
  // }
}

const products = [
  new ProductModel(
    1,
    "Levis",
    "Best quality Trousers",
    "https://iplanet.one/cdn/shop/files/iPhone_14_Blue_PDP_Image_Position-1A__WWEN.jpg?v=1691142210",
    190000.99,
    "Category 1",
    ["M", "L", "S"]
  ),
  new ProductModel(
    2,
    "Product 2",
    "Best Quality Clothes",
    "https://iplanet.one/cdn/shop/files/iPhone_14_Blue_PDP_Image_Position-1A__WWEN.jpg?v=1691142210",
    290000.99,
    "Category 2",
    ["M", "L"]
  ),
  new ProductModel(
    3,
    "Tablet iPad",
    "Apple Corporation product company",
    "https://iplanet.one/cdn/shop/files/iPhone_14_Blue_PDP_Image_Position-1A__WWEN.jpg?v=1691142210",
    90000.99,
    "Category 3",
    ["No size"]
  ),
  new ProductModel(
    4,
    "Nike Shoes",
    "High-quality running shoes",
    "https://example.com/images/nike-shoes.jpg",
    4999.99,
    "Footwear",
    ["7", "8", "9", "10"]
  ),
  new ProductModel(
    5,
    "Samsung Galaxy S23",
    "Flagship smartphone from Samsung",
    "https://example.com/images/samsung-galaxy.jpg",
    79999.99,
    "Electronics",
    ["No size"]
  ),
  new ProductModel(
    6,
    "Gaming Laptop",
    "High-performance gaming laptop with RTX 3080",
    "https://example.com/images/gaming-laptop.jpg",
    159999.99,
    "Electronics",
    ["No size"]
  ),
  new ProductModel(
    7,
    "Rolex Watch",
    "Luxury wristwatch for men",
    "https://example.com/images/rolex-watch.jpg",
    499999.99,
    "Accessories",
    ["No size"]
  ),
  new ProductModel(
    8,
    "Adidas T-Shirt",
    "Comfortable and stylish sports T-shirt",
    "https://example.com/images/adidas-tshirt.jpg",
    1999.99,
    "Clothing",
    ["S", "M", "L", "XL"]
  ),
  new ProductModel(
    9,
    "Sony Headphones",
    "Noise-cancelling wireless headphones",
    "https://example.com/images/sony-headphones.jpg",
    24999.99,
    "Electronics",
    ["No size"]
  ),
  new ProductModel(
    10,
    "Backpack",
    "Durable and spacious backpack",
    "https://example.com/images/backpack.jpg",
    2999.99,
    "Accessories",
    ["No size"]
  ),
];
