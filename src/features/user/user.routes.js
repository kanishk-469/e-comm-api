import express from "express";
import UserController from "./user.controller.js";
import { jwtAuth } from "../../middlewares/jwtAuth.middleware.js";

const userRouter = express.Router();

const userController = new UserController();

// userRouter.post("/signup", userController.signUp);
userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next); // to bind this keyword
});
// userRouter.post("/signin", userController.signIn);
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res); /// need to bind
});

///update new password
userRouter.put("/resetPassword", jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});

export default userRouter;
