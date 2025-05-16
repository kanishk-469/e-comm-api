//manages routes/paths to ProductController

//1. Import express
import express from "express";
import ProductController from "./product.controller.js";
import { uploadFile } from "../../middlewares/fileupload.middleware.js";
import { jwtAuth } from "../../middlewares/jwtAuth.middleware.js";

//2. Initialize express router
const router = express.Router();

const productController = new ProductController();

// All the paths to controller methods.

//// localhost:1010/api/products/rating?userID=2&productID=1&rating=4 for rating a product
router.post("/rating", jwtAuth, (req, res, next) =>
  productController.rateProduct(req, res, next)
);

//localhost:1010/api/products/filter?minPrice=10&maxPrice=20&category=category1
// router.get("/filter", (req, res) => productController.filterProducts(req, res));
router.get("/filter", (req, res) => {
  productController.filterProducts(req, res); // need to bind the filterProducts method
});

//localhost:1010/api/products already completed
router.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
router.post("/", uploadFile.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});

router.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res, next);
});
router.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default router;
