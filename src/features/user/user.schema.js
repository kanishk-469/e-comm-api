///create mongoose schema
///refer:- https://mongoosejs.com/docs/guide.html
import mongoose from "mongoose";

const typeOfUser = ["Customer", "Seller"];
export const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: true, // Ensures password field is mandatory
    validate: {
      validator: function (value) {
        return /^(?=.*[@$!%*#?&])[\dA-Za-z@$!%*#?&]{8,}/.test(value);
      },
      message:
        "Password should have characters, symbols and have at least one special character",
    },
  },

  type: { type: String, enum: typeOfUser, required: true }, // Ensuring `type` is mandatory
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
