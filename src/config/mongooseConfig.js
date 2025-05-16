import mongoose from "mongoose";
import { categorySchema } from "../features/product/category.schema.js";
// Can Refer https://www.npmjs.com/package/mongoose

const url = process.env.DB_URL; // dotenv npm package used

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Using Mongoose is Connected..!");
    await addCategories();
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong connecting using mongoose!");
  }
};

async function addCategories() {
  const CategoryModel = mongoose.model("Category", categorySchema);
  const categories = await CategoryModel.find();

  if (!categories || categories.length == 0) {
    await CategoryModel.insertMany([
      { name: "Clothing" },
      { name: "Books" },
      { name: "Electronics" },
    ]);
  }

  console.log("Categories are Added!!");
}
