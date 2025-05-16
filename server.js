import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import fs from "fs";

import ProductRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import userRouter from "./src/features/user/user.routes.js";
import { jwtAuth } from "./src/middlewares/jwtAuth.middleware.js";
import cartRouter from "./src/features/cart/cartItems.routes.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.router.js";
// import { basicAuthorizer } from "./src/middlewares/basicAuth.middleware.js";
// import apiDocs from "./swagger.json assert {type:"json"}";
// import { createRequire } from "module";

// Create Server, Main Entry Point of Back-End API
const server = express();

///Using CORS NodeJS module
/// import cors from "cors"
/// server.use(cors());

////CORS Policy Configure, using middleware without cors nodejs module
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Give access for all client
  // res.header("Access-Control-Allow-Origin", "http://localhost:5500");

  res.header("Access-Control-Allow-Headers", "*"); // allow all headers
  // req.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  res.header("Access-Control-Allow-Methods", "*"); // allow all types of methods get,post,put,delete etc.

  //return ok for preflight request, method is "OPTIONS"
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  }
  next();
});

/// Version v22.11.0 assert keyword is not working, that's why i have used fs module
const apiDocs = JSON.parse(fs.readFileSync("./swaggerV3.json", "utf8"));
console.log(typeof apiDocs);

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

///Need to add at APPLICATION LEVEL MIDDLEWARE, npm i body-parser for POST request
server.use(bodyParser.json());

////Logging all types of request at Application level and store in log.txt file
server.use(loggerMiddleware);

// request is coming like localhost:1010/api/products
// request is coming like localhost:1010/api/users

//For all request related to products, redirect to products routes
//Basic Authentication used, which is not recommended
//localhost:1010/api/products
// server.use("/api/products", basicAuthorizer, ProductRouter);

//For all request related to products, redirect to products routes
//JWT Authentication used, which is recommended token based -> eerwererqwqd.errgfvfv.reer4rttt
//localhost:1010/api/products
server.use("/api/products", jwtAuth, ProductRouter);

//localhost:1010/api/cartItems
server.use("/api/cartItems", loggerMiddleware, jwtAuth, cartRouter);

//For all request related to user, redirect to user routes
//localhost:1010/api/user
server.use("/api/users", userRouter);

///For placing order , request is redirected to the order.routes.js file
server.use("/api/orders", jwtAuth, orderRouter);

///for like both Product and Category, Multiple reference concept, OjectId, refPath
server.use("/api/likes", jwtAuth, likeRouter);

/// Default Request Handler
server.get("/", (req, res, next) => {
  res.send("Welcome to Express Server for E-Commerce Backend API");
});

//////Error Hanlder Middleware, should be at Last position
server.use((err, req, res, next) => {
  console.log(err);

  //for duplicate email error handle
  if (err.code === 11000) {
    return res.status(400).json({ Email: "Email Already Exit.!" });
  }

  //For User defined ERROR, like storing the password,and not following correct pattern
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }

  //For Application Level ERROR
  //Now we need to check, instanceof is a keyword in JS, which tells us instance of this type
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }

  //Also I can log those errors and store in logs or log file
  //Server Error
  res.status(500).send("Something went Wrong!! Please try again later!");
});

////Last position where non of the above path matches, we need to send response, "Resource not found"
/// Basically "API Not Found"
///4. Middleware to handle 404 requests.(path mismatched)
server.use((req, res) => {
  res
    .status(404)
    // .send(
    //   "API Not Found!! Please check our documentation for more information at URL:localhost:1010/api-docs"
    // );
    .json({
      success: false,
      error: `Invalid Path ${req.originalUrl}`,
      message:
        "API Not Found!! Please check our documentation for more information at URL:localhost:1010/api-docs",
    });
});

//5. Specify Port
server.listen(8080, () => {
  console.log("Express Server is Listening on 8080");
  // connectToMongoDB();
  connectUsingMongoose();
});
