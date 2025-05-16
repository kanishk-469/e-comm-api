///productId , userId , quantity

import UserModel from "../user/user.model.js";
import ProductModel from "../product/product.model.js";

class CartItemModel {
  constructor(productId, userId, quantity, id) {
    this.productId = productId;
    this.userId = userId;
    this.quantity = quantity;
    this.id = id;
  }

  static get(userId) {
    return cartItems.filter((i) => i.userId == userId);
  }

  static add(productId, userId, quantity) {
    const cartItem = new CartItemModel(productId, userId, quantity);
    cartItem.id = cartItems.length + 1; /// Object me "id" property add kiya

    // 1. Validate User and Product
    const user = UserModel.getAll().find((u) => u.id == userId);
    console.log(user);
    if (!user) {
      return "User Not Found";
    }

    // Validate Product
    const product = ProductModel.GetAll().find((p) => p.id == productId);

    if (!product) {
      return "Product Not found";
    }

    ///2.Check if there are any items in the cart and if not then add
    /// Items to the Cart
    const item = cartItems.find((u) => u.id == userId);
    if (item) {
      cartItems.push(cartItem);
      return cartItem;
    }
  }

  static delete(cartItemId, userId) {
    const cartItemIndex = cartItems.findIndex(
      (i) => i.id == cartItemId && i.userId == userId
    );
    if (cartItemIndex == -1) {
      return "Item no Found";
    } else {
      cartItems.splice(cartItemIndex, 1);
    }
  }
}

const cartItems = [
  new CartItemModel(1, 2, 4, 1),
  new CartItemModel(1, 2, 10, 2),
];

export default CartItemModel;
