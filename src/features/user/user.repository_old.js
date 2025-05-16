import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

class UserRepository {
  async SignUp(newUser) {
    try {
      ///1. Get the Database
      const db = getDB();

      ////2.To Get the collection(we can say table in SQL Database)
      const collection = db.collection("users");

      //   const newUser = {
      //     name,
      //     email,
      //     password,
      //     type,
      //   };
      //   // or convert string to JSON Object
      //   const jsonData = JSON.parse(newUser);

      ////3.Insert the Document
      //refer- https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
      await collection.insertOne(newUser);
      //newUser.id = users.length + 1,
      // users.push(newUser);
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async signIn(email, password) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);

      // 3. Find the document.
      return await collection.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();
      const collection = db.collection("users");
      return await collection.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default UserRepository;
