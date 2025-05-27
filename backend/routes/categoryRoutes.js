import express from "express";
const router = express.Router();
import { authenticate, authorizeAdmin } from "../middlewares/authmiddleware.js";
import { createCategory, deleteCategory, listCategory, readCategory, updateCategory } from "../controllers/categoryController.js";

router.route("/").post(authenticate,authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate,authorizeAdmin,updateCategory)
router.route("/:categoryId").delete(authenticate,authorizeAdmin,deleteCategory)
router.route("/categories").get(listCategory)
router.route("/:categoryId").get(readCategory)

export default router;
