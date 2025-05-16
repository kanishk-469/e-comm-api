import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productID, userID, quantity) {
    try {
      // console.log(userID);
      const db = getDB();
      const collection = db.collection(this.collection);

      ///Human readable id to update in cartItems collection
      const id = await this.getNextCounter(db);
      console.log(id);

      // find the document
      // either insert or update
      // Insertion.
      ///search upsert mongodb, either create new quantity or update
      // old quantity
      await collection.updateOne(
        { productID: new ObjectId(productID), userID: new ObjectId(userID) },
        {
          $setOnInsert: { _id: id },
          $inc: {
            quantity: quantity,
          },
        },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      console.log(userID);
      return await collection.find({ userID: new ObjectId(userID) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async delete(userID, cartItemID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemID),
        userID: new ObjectId(userID),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getNextCounter(db) {
    //findOneAndUpdate() returns the original document if returnDocument not used.
    //Returns the original document by default. Returns the updated docume
    // nt if returnNewDocument is set to true or returnDocument
    // is set to after.
    const returnDocument = await db.collection("counters").findOneAndUpdate(
      { _id: "cartItemId" },
      {
        $inc: { value: 1 },
      },
      { returnDocument: "after" }
    );
    console.log(returnDocument);
    return returnDocument.value;
  }
}
