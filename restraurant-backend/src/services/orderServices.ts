// order dto
import { CreateOrderDto } from "../dto/orderDto";
// prisma
import prisma from "../prisma/client";
// dayjs
import dayjs from "dayjs";

class OrderService {
  // get an order by id of specific restaurant
  getOrderById = async (id: string, slug: string) => {
    const order = await prisma.order.findUnique({
      where: {
        id,
        restaurant: {
          slug: slug,
        },
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
  getOrderByTransactionId = async (
    merchantTransactionId: string,
    slug: string
  ) => {
    // Find the transaction by merchantTransactionId
    const transaction = await prisma.transaction.findUnique({
      where: {
        merchantTransactionId: merchantTransactionId,
        restaurant: {
          slug: slug,
        },
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
        restaurant: {
          slug: slug,
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

  // get all orders of restaurant
  getAllOrders = async (slug: string) => {
    const orders = await prisma.order.findMany({
      where: {
        restaurant: {
          slug: slug,
        },
      },
      include: {
        orderItems: {
          include: {
            foodItem: true, // Include food item details as well
          },
        },
        transaction: true,
        restaurant: true,
      },
    });

    console.log("order", orders);

    return orders; // Return the associated order
  };

  // update order status of the order in specific restaurant
  updateOrderStatus = async (id: string, status: string, slug: string) => {
    const order = await prisma.order.update({
      where: {
        id: id,
        restaurant: {
          slug: slug,
        },
      },
      data: {
        status: status,
      },
    });
    return order;
  };
}

export default new OrderService();
