import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

//create model from userSchema
const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async SignUp(user) {
    try {
      console.log(user);
      //Create instance of model, to create single document in User collection
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      //  console.log(err.errorResponse.keyValue);

      if (err.code === 11000) {
        throw err;
      }

      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong with database", 500);
      }
    }
  }

  async signIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async resetPassword(userId, pswd) {
    try {
      const user = await UserModel.findById(userId);
      //user shouldn't have undefined or null value, then it goes inside if statement
      if (user) {
        user.password = pswd;
        await user.save();
      } else {
        throw new Error("User Not Found..!");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
