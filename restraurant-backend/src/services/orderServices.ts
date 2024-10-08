// order dto
import { CreateOrderDto } from "../dto/orderDto";
// prisma
import prisma from "../prisma/client";
// dayjs
import dayjs from "dayjs";

class OrderService {
  // get an order by id
  getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        orderItems: {
          include: {
            foodItem: true,
          },
        },
      },
    });
    return order;
  };

  // Get order by transaction ID and calculate order number for the day
  getOrderByTransactionId = async (merchantTransactionId: string) => {
    // Find the transaction by merchantTransactionId
    const transaction = await prisma.transaction.findUnique({
      where: {
        merchantTransactionId: merchantTransactionId,
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                foodItem: true, // Include food item details
              },
            },
          },
        },
      },
    });

    console.log("transaction", transaction);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Get the date of the current order (without time)
    const orderDate = dayjs(transaction.order.createdAt)
      .startOf("day")
      .toDate();

    // Count the number of orders placed before the current order on the same day
    const ordersBefore = await prisma.order.count({
      where: {
        createdAt: {
          lt: transaction.order.createdAt,
          gte: orderDate, // Orders on the same day
        },
      },
    });

    // The order number for the day is the number of orders before + 1
    const orderNumberForTheDay = ordersBefore + 1;

    // Return the transaction, along with the order number for the day
    return {
      transaction,
      orderNumberForTheDay,
    };
  };

  // get all orders
  getAllOrders = async () => {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            foodItem: true, // Include food item details as well
          },
        },
        transaction: true,
      },
    });

    console.log("order", orders);

    return orders; // Return the associated order
  };

  // update an order by status
  updateOrderStatus = async (id: string, status: string) => {
    const order = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    return order;
  };
}

export default new OrderService();
