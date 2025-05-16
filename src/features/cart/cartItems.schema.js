///create mongoose schema
///refer:- https://mongoosejs.com/docs/guide.html
import mongoose, { Schema } from "mongoose";

export const cartItemsSchema = new Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  quantity: Number,
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
