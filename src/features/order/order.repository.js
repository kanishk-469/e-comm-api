import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

class OrderRepository {
  constructor() {
    this.collectionName = "orders";
  }
  async placeOrder(userId) {
    ///Use Transaction Concept of database

    ///1. Get cart items of user , calculate the totalAmount

    ///2. Create the record of order

    ///3. Reduce the stock

    ///4. Clear the cartItems of a specific User.

    try {
      const db = getDB();
      const client = getClient();
      const session = client.startSession();
      session.startTransaction(); //either entire operations execute or none of the operations execute

      ///1. Get cart items of a specific user ,calculate the totalAmount
      const items = await this.getTotalAmount(userId, session);
      const totalFinalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(totalFinalAmount);

      ///2. Create the record of order
      const newOrder = new OrderModel(
        new ObjectId(userId),
        totalFinalAmount,
        new Date().toLocaleString()
      );

      // console.log(newOrder);
      await db.collection(this.collectionName).insertOne(newOrder, { session });

      ///3. Reduce the stock in products collection
      for (let itemObj of items) {
        await db.collection("products").updateOne(
          {
            _id: itemObj.productID,
          },
          {
            $inc: { stocks: -itemObj.quantity },
          },
          { session }
        );
      }

      //let say if any error aur exception raised here, Intentionally failing the last operation
      // throw new Error("Something is wrong in placeOrder Function");
      ///4. Clear the cartItems of a specific User.
      await db
        .collection("cartItems")
        .deleteMany({ userID: new ObjectId(userId) }, { session });

      session.commitTransaction();
      session.endSession();
      return;
    } catch (err) {
      session.abortTransaction(); // avoid memory leak
      session.endSession();
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    // console.log(userId);
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          // stage 1. get the cart items from cartItems collection of a User
          {
            $match: { userID: new ObjectId(userId) },
          },
          //// stage 2: left outer Join 2 collections, with condition productId and _id matches
          // and attach the 'productInfo' object with cartItems details and
          /// Get the products from products collection
          {
            $lookup: {
              from: "products", // Second collection to check
              localField: "productID", // Field in products
              foreignField: "_id", // Matching field in products
              as: "productInfo", // Merged result
            },
          },
          ///stage 3: unwind the productInfo(array of objects)
          {
            $unwind: "$productInfo",
          },
          ///stage 4: calculate totalAmount for each cartItems
          {
            $addFields: {
              totalAmount: { $multiply: ["$productInfo.price", "$quantity"] },
            },
          },
        ],
        { session }
      )
      .toArray();
    return items;
  }
}

export default OrderRepository;
