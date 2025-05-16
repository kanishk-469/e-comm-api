import LikeRepository from "./like.repository.js";

class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(id, type);
      return res.status(200).send(likes);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }

  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userId;

      if (type !== "Product" && type !== "Category") {
        return res.status(400).send("Invalid Type..!");
      }

      if (type === "Product") {
        const likedItem = await this.likeRepository.likeProduct(userId, id);
        return res.status(200).send("Product is Liked");
      } else {
        const likedItem = await this.likeRepository.likeCategory(userId, id);
        return res.status(200).send("Category is Liked");
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }
}

export default LikeController;
