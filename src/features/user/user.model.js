import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }
  // static async SignUp(name, email, password, type) {
  //   try {
  //     ///1. Get the Database
  //     const db = getDB();

  //     ////2.To Get the collection(we can say table in SQL Database)
  //     const collection = db.collection("users");

  //     const newUser = {
  //       name: name,
  //       email,
  //       password,
  //       type,
  //     };
  //     ////3.Insert the Document
  //     //refer- https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
  //     await collection.insertOne(newUser);
  //     //newUser.id = users.length + 1,
  //     // users.push(newUser);
  //     return newUser;
  //   } catch (err) {
  //     throw new ApplicationError("Something went wrong", 500);
  //   }
  // }

  // static SignIn(email, password) {
  //   const user = users.find((user) => {
  //     return user.email == email && user.password == password;
  //   });

  //   return user;
  // }

  static getAll() {
    return users;
  }
}

const users = [
  {
    id: 1,
    name: "Seller User",
    email: "john@gmail.com",
    password: "qwerty",
    type: "Seller",
  },
  {
    id: 2,
    name: "Customer User",
    email: "customer@gmail.com",
    password: "qwerty2",
    type: "Customer",
  },
];
