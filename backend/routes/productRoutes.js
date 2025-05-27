import express from "express";
const router = express.Router();
import { authenticate, authorizeAdmin } from "../middlewares/authmiddleware.js";
import { checkId } from "../middlewares/checkId.js";

//controllers
import {
  addProduct,
  fetchAllProducts,
  fetchProducts,
  fetchProductsById,
  removeProduct,
  updateProductDetails,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import formidable from "express-formidable";

router.route("/").get(fetchProducts).post(authenticate, authorizeAdmin, formidable(), addProduct);
router.route("/allProducts").get(fetchAllProducts)
router.route("/:id/reviews").post(authenticate,checkId,addProductReview)
router.route("/top").get(fetchTopProducts)
router.route("/new").get(fetchNewProducts)
router
  .route("/:id")
  .get(fetchProductsById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);
router.route("/filtered-products").post(filterProducts)
export default router;
