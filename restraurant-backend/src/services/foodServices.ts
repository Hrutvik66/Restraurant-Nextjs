// express
import { Request, Response } from "express";
// prisma
import prisma from "../prisma/client";
// foodItem Dto
import { CreateFoodItemDto, UpdateFoodItemDto } from "../dto/foodItemDto";
// auth
import { CustomJwtPayload, CustomRequest } from "../middleware/auth.middleware";

class FoodItemService {
  // check request authentication
  checkRequestAuthentication = (req: Request, res: Response) => {
    if ((req as CustomRequest).token) {
      const { role } = (req as CustomRequest).token as CustomJwtPayload;
      if (role !== "owner") {
        throw new Error(
          "Access denied:You are not allowed to do this action!!"
        );
      }
    }
  };
  // create food item
  createFoodItem = async (data: CreateFoodItemDto) => {
    const foodItem = await prisma.foodItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isListed: data.isListed,
        restaurant: {
          connect: {
            id: data.restaurant,
          },
        },
      },
      include: {
        OrderItem: true,
      },
    });
    return foodItem;
  };

  // get all food items
  getAllFoodItems = async () => {
    const foodItems = await prisma.foodItem.findMany({
      include: {
        OrderItem: true,
      },
    });
    return foodItems;
  };

  // get a food item by id
  getFoodItemById = async (id: string) => {
    const foodItem = await prisma.foodItem.findUnique({
      where: {
        id: id,
      },
      include: {
        OrderItem: true,
      },
    });
    return foodItem;
  };

  // update a food item
  updateFoodItem = async (id: string, data: UpdateFoodItemDto) => {
    const foodItem = await prisma.foodItem.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isListed: data.isListed,
      },
    });
    return foodItem;
  };

  // update a status of the food item
  updateFoodItemStatus = async (id: string, isListed: boolean) => {
    const foodItem = await prisma.foodItem.update({
      where: {
        id: id,
      },
      data: {
        isListed: isListed,
      },
    });
    return foodItem;
  };

  // delete a food item
  deleteFoodItem = async (id: string) => {
    const foodItem = await prisma.foodItem.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });
    return foodItem;
  };
}

export default new FoodItemService();
