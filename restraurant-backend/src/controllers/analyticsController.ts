// controllers/analyticsController.ts

import { Request, Response } from "express";
import {
  getSalesDataForWeek,
  getTotalRevenue,
  getOrdersCountThisMonth,
  getTopSellingItems,
  getMenuItemsCount,
} from "../services/analyticsService";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [
      weeklySalesData,
      totalRevenue,
      ordersCount,
      topSellingItems,
      menuItemsCount,
    ] = await Promise.all([
      getSalesDataForWeek(),
      getTotalRevenue(),
      getOrdersCountThisMonth(),
      getTopSellingItems(),
      getMenuItemsCount(),
    ]);

    // Format data for sales per day for the last 7 days
    const formattedSalesData = weeklySalesData.map((sale: any) => {
      const dayOfWeek = sale.createdAt.toLocaleDateString("en-US", {
        weekday: "short",
      }); // e.g., 'Mon', 'Tue'
      return {
        name: dayOfWeek,
        sales: sale._sum.amount || 0,
      };
    });

    res.json({
      salesData: formattedSalesData,
      totalRevenue: totalRevenue._sum.amount || 0,
      ordersCount,
      topSellingItems: topSellingItems.map((item: any) => ({
        foodItemId: item.foodItemId,
        quantitySold: item._sum.quantity || 0,
      })),
      menuItemsCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
};
