///create mongoose schema(structure/blueprint/shape of data)
///refer:- https://mongoosejs.com/docs/guide.html
import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  imageUrl: String,
  price: Number,
  category: String,
  inStock: Number,
  size: Array,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
  ],
});

/*
The permitted SchemaTypes are:
String
Number
Date
Buffer
Boolean
Mixed
ObjectId
Array
Decimal128
Map
UUID
Double
Int32
*/
