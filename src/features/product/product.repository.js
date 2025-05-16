import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { reviewSchema } from "./review.schema.js";
import { productSchema } from "./product.schema.js";
import { categorySchema } from "./category.schema.js";

const ReviewModel = mongoose.model("Review", reviewSchema);
const ProductModel = mongoose.model("Product", productSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
      // // 1 . Get the db.
      // const db = getDB();
      // //2. get the collection
      // const collection = db.collection(this.collection);
      // await collection.insertOne(newProduct);
      // return newProduct;

      ///Simplied Code using mongoose ODM Library
      console.log(productData);

      productData.categories = productData.category
        .split(",")
        .map((e) => e.trim());
      console.log(productData);

      //1. Add product to products collection, assuming categories
      //have either names or id of the categories..
      const newProduct = new ProductModel(productData);
      const savedProduct = newProduct.save();

      //2. Update categories
      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        {
          $push: { products: new ObjectId(savedProduct._id) },
        }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAll() {
    try {
      // const db = getDB();
      // const collection = db.collection(this.collection);
      // const products = await collection.find().toArray();

      //Using mongoose
      const products = await ProductModel.find();
      return products;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async filter(minPrice, maxPrice, category) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     let filterExpression = {};
  //     if (minPrice) {
  //       filterExpression.price = { $gte: parseFloat(minPrice) };
  //     }
  //     if (maxPrice) {
  //       filterExpression.price = {
  //         ...filterExpression.price,
  //         $lte: parseFloat(maxPrice),
  //       };
  //     }
  //     if (category) {
  //       filterExpression.category = category;
  //     }
  //     return await collection.find(filterExpression).toArray();
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  // To understand Operators in MongoDB like $and,$or,$in ,$gte ,$lte, $lt
  // $gt, $eq so on, we edit the below code
  async filter(minPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }

      // //If both condition satified then we get document from product collection
      // if (category) {
      //   filterExpression = { $and: [{ category: category }, filterExpression] };
      // }

      // //Atleast one condition should satify, then we get document from product collection
      // if (category) {
      //   filterExpression = { $or: [{ category: category }, filterExpression] };
      // }

      // Convert categories to array from string
      // query URL string = localhost:8080/api/products/filter?categories=['New','clothing']&minPrice=30000
      // categories=['New','clothing']
      const categoriesArr = JSON.parse(categories.replace(/'/g, '"'));
      //Atleast one condition should satify with multiple catergories's array , then we get
      //document from product collection
      if (categories) {
        filterExpression = {
          $or: [{ category: { $in: categoriesArr } }, filterExpression],
        };
      }

      // return await collection.find(filterExpression).toArray();

      //By using projection operators,It allow us to change the view of data,
      // which we are recieving on the client, we can control the fields,
      //whichever to send as response from the collection(table) or not
      return await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0, ratings: { $slice: 1 } })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async rate(userID, productID, rating){
  //     try{
  //         const db = getDB();
  //         const collection = db.collection(this.collection);
  //         // 1. Find the product
  //         const product = await collection.findOne({_id:new ObjectId(productID)})
  //         // 2. Find the rating

  //         const userRating = await product?.ratings?.find(r=>r.userID==userID);
  //         if(userRating){
  //         // 3. Update the rating
  //         await collection.updateOne({
  //             _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
  //         },{
  //             $set:{
  //                 "ratings.$.rating":rating
  //             }
  //         }
  //         );
  //         }else{
  //             await collection.updateOne({
  //                 _id:new ObjectId(productID)
  //             },{
  //                 $push: {ratings: {userID:new ObjectId(userID), rating}}
  //             })
  //         }
  //     }catch(err){
  //         console.log(err);
  //         throw new ApplicationError("Something went wrong with database", 500);
  //     }
  // }

  async rate(userID, productID, rating) {
    try {
      // const db = getDB();
      // const collection = db.collection(this.collection);
      // //Atomic operations, both should execute
      // // 1. Removes existing entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productID),
      //   },
      //   {
      //     $pull: { ratings: { userID: new ObjectId(userID) } },
      //   }
      // );
      // // 2. Add new entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productID),
      //   },
      //   {
      //     $push: { ratings: { userID: new ObjectId(userID), rating } },
      //   }
      // );

      //1. check if product exists
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product not found!!");
      } else {
        ///2. Get the existing review
        const userReview = await ReviewModel.findOne({
          productId: new ObjectId(productID),
          userId: new ObjectId(userID),
        });
        ///3. update with a new rating
        if (userReview) {
          userReview.rating = rating;
          await userReview.save();
        } else {
          ///4. Create new Review of a product
          const newReview = new ReviewModel({
            productId: new ObjectId(productID),
            userId: new ObjectId(userID),
            rating: rating,
          });
          const savedReview = await newReview.save();

          const findProductReviewField = await ProductModel.findById(productID);
          findProductReviewField.reviews.push(savedReview._id);
          await findProductReviewField.save();
        }
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            /// stage 1: get average price per category
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
