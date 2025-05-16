import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderRepository from "./order.repository.js";

class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async placeOrder(req, res) {
    try {
      const userId = req.userId; /// from JWT token
      await this.orderRepository.placeOrder(userId);
      return res.status(201).send("Order is Successful");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
}

export default OrderController;
