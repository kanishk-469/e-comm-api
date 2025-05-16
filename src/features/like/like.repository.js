import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";

const likeModel = mongoose.model("Like", likeSchema);
class LikeRepository {
  async getLikes(id, type) {
    try {
      return await likeModel
        .find({
          likeable: new ObjectId(id),
          types: type,
        })
        .populate("user")
        .populate({ path: "likeable", model: type });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async likeProduct(userId, productId) {
    try {
      const newProductLike = new likeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(productId),
        types: "Product",
      });
      return await newProductLike.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      const newCategoryLike = new likeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(categoryId),
        types: "Category",
      });
      return await newCategoryLike.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default LikeRepository;
