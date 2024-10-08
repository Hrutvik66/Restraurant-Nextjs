// express router
import { Router } from "express";
// order Controller
import OrderController from "../controllers/orderController";

const orderRouter = Router();

const {
  // createOrder,
  getOrderById,
  getOrderByTransactionId,
  getAllOrders,
  updateOrderStatus,
} = OrderController;

// create an order
// orderRouter.post("/", createOrder);

// get an order by id
orderRouter.get("/:id", getOrderById);

// get order by transaction id
orderRouter.get("/transaction/:id", getOrderByTransactionId);

// get all orders
orderRouter.get("/", getAllOrders);

// update an order by status
orderRouter.put("/:id", updateOrderStatus);

export default orderRouter;
