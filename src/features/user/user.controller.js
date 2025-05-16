import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      //need to hash password using library bcrypt npm i bcrypt.
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, type);
      const registeredUser = await this.userRepository.SignUp(user);
      if (user) {
        const userWithNoPassword = {
          name: user.name,
          email: user.email,
          type: user.type,
          _id: user._id,
        };
        // res.status(201).send(userWithNoPassword);
        res.status(201).send(registeredUser);
      }
    } catch (err) {
      next(err);
      console.log(err);
      throw new ApplicationError("Resource can't Created", 404);
    }

    // if (user) {
    //   res.status(201).send(user);
    // } else {
    //   res.status(404).send("Resouce can't created");
    // }
  }
  // async signIn(req, res) {
  //   const { email, password } = req.body;
  //   const user = await this.userRepository.SignIn(email, password);
  //   if (user) {
  //     // create token and send to client
  //     const token = jwt.sign(
  //       { userID: user.id, email: user.email },
  //       "KKJXxpGMjGFerPCUGXdt89jOFZ6H47Vc",
  //       { expiresIn: "1h" }
  //     );
  //     //res.send("Login Successful");
  //     //send token
  //     res.status(200).send(token);
  //   } else {
  //     res.status(400).send("Invalid Credential");
  //   }
  // }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return res.status(400).send("Incorrect Credential");
      } else {
        ///Comapare plaintext password with DB hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          // Create token and send to client
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          //res.send("Login Successful");
          //send token
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credential");
        }
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong..!!");
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      const userId = req.userId;
      // console.log(typeof newPassword, userId);
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      // console.log(hashedPassword);

      await this.userRepository.resetPassword(userId, hashedPassword);
      return res.status(200).send("Password is reset");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong..!!");
    }
  }
}
