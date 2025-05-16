///To under stand Multiple references ex:- product, category both we can like
import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "types",
  },
  types: {
    type: String,
    enum: ["Product", "Category"],
  },

  /// we have added middleware before save or after save operation on mongodb database using 2 hooks pre and post
})
  .pre("save", (next) => {
    console.log("Like is coming in");
    next();
  })
  .post("save", (doc) => {
    console.log("Like is saved");
    console.log(doc);
    //here also i can send and email that your product has received a new like
  })
  /// we have added middleware before find or after find operation on mongodb database using 2 hooks pre and post
  .pre("find", (next) => {
    console.log("Retrieving likes");
    next();
  })
  .post("find", (docs) => {
    console.log("Find is Completed");
    console.log(docs);
  });
