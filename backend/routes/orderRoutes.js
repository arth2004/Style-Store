import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authmiddleware.js";
import { calcualteTotalSalesByDate, calculateTotalSales, countTotalOrders, createOrder, findOrderById, getAllOrders, getUserOrders, markOrderAsDelivered, markOrderAsPaid } from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate,authorizeAdmin, getAllOrders);
router.route("/mine").get(authenticate,getUserOrders)
router.route("/order-count").get(countTotalOrders)
router.route("/total-sales").get(calculateTotalSales)
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate)
router.route("/:id").get(authenticate,findOrderById)
router.route("/:id/pay").put(authenticate,markOrderAsPaid)
router.route("/:id/deliver").put(authenticate,authorizeAdmin,markOrderAsDelivered)
export default router;
