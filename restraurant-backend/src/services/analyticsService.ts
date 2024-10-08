// services/analyticsService.ts

import prisma from "../prisma/client";

export const getSalesDataForWeek = async () => {
  const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7)); // Date 7 days ago

  return await prisma.transaction.groupBy({
    by: ["createdAt"],
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: oneWeekAgo, // Sales data for the last 7 days
      },
    },
    orderBy: {
      createdAt: "asc", // Orders the result by date ascending
    },
  });
};

export const getTotalRevenue = async () => {
  return await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
  });
};

export const getOrdersCountThisMonth = async () => {
  return await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of this month
      },
    },
  });
};

export const getTopSellingItems = async () => {
  return await prisma.orderItem.groupBy({
    by: ["foodItemId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5, // Get top 5 items
  });
};

export const getMenuItemsCount = async () => {
  return await prisma.foodItem.count();
};
