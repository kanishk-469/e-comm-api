import { MongoClient } from "mongodb";

// const url = "mongodb://localhost:27017/ecomdb";
// If the above url gives error (error may be caused due to IPv4/IPv6 confi
// guration conflict), then try the url given below
// const url = "mongodb://127.0.0.1:27017/ecomdb";

// const url = "mongodb://127.0.0.1:27017/ecomdb"; // Hardcoded, Firstly,Computer
// // address of MongoDB Server, is stored in url variable/constant

const url = process.env.DB_URL; // dotenv npm package used

let client;
export const connectToMongoDB = async () => {
  MongoClient.connect(url)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("From NodeJS, MongoDB is Connected..!!");
      //   console.log(client);
      console.log("************************************");
      // console.log(client.options);
      // console.log("************************************");
      // console.log("Database Name: " + client.options.dbName);

      ///call createCounter function to create counter table(collection)
      createCounter(client.db());
      createIndexes(client.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

// get database client to set-up transaction in our order.repository.js
export const getClient = () => {
  return client;
};

export const getDB = () => {
  return client.db(); /// already database name is written in url
};

/*Step: 1 - Create counter Collection(_id:"cartItemId",value: 0 ) inside 
mongodb NoSQL Database. for human readable _id fields for small application*/

export const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  console.log("counters created ", existingCounter);
  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  }
};

/// Create Indexes(Table of content) for faster quering(read) data in database
/// Refer mongodb indexes documentation website, single indexes, compound indexes
//, text indexes so on, Indexing helps mongodb, to query faster in huge database.
const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 });
    await db.collection("products").createIndex({ name: 1, category: -1 });
    await db.collection("products").createIndex({ desc: "text" });
  } catch (err) {
    console.log(err);
  }
  console.log("Indexes are created!");
};
