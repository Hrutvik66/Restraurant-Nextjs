// express
import { Request, Response } from "express";

// orderService
import OrderService from "../services/orderServices";
// socket io server
import { io } from "../index"; // Import the io instance

const {
  getOrderById,
  getOrderByTransactionId,
  getAllOrders,
  updateOrderStatus,
} = OrderService;

class OrderController {
  // get an order by id
  getOrderById = async (req: Request, res: Response) => {
    try {
      const order = await getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to get order" });
    }
  };

  // get order by transaction id and calculate order number for the day
  getOrderByTransactionId = async (req: Request, res: Response) => {
    try {
      const order = await getOrderByTransactionId(req.params.id as string);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      console.log("order", order);

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to get order" });
    }
  };

  // get all orders
  getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get all orders" });
    }
  };

  // update an order by status
  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const updatedOrder = await updateOrderStatus(
        req.params.id,
        req.body.status
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      // Emit event to update clients in real-time
      io.emit("orderStatusUpdated", updatedOrder); // Notify all clients of the status change

      res.status(200).json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  };
}

export default new OrderController();
