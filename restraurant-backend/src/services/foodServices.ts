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
            slug: data.slug,
          },
        },
      },
      include: {
        OrderItem: true,
      },
    });
    return foodItem;
  };

  // get all food items of the restaurant using slug
  getAllFoodItems = async (slug: string) => {
    const foodItems = await prisma.foodItem.findMany({
      where: {
        restaurant: {
          slug: slug,
        },
      },
      include: {
        OrderItem: true,
      },
    });
    return foodItems;
  };

  // get a food item by id of specific restaurant
  getFoodItemById = async (id: string, slug: string) => {
    const foodItem = await prisma.foodItem.findUnique({
      where: {
        id: id,
        restaurant: {
          slug: slug,
        },
      },
      include: {
        OrderItem: true,
      },
    });
    return foodItem;
  };

  // update a food item of specified restaurant
  updateFoodItem = async (id: string, data: UpdateFoodItemDto) => {
    const foodItem = await prisma.foodItem.update({
      where: {
        id: id,
        restaurant: {
          slug: data.slug,
        },
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

  // update a list status of the food item of specific restaurant
  updateFoodItemStatus = async (
    id: string,
    isListed: boolean,
    slug: string
  ) => {
    const foodItem = await prisma.foodItem.update({
      where: {
        id: id,
        restaurant: {
          slug: slug,
        },
      },
      data: {
        isListed: isListed,
      },
    });
    return foodItem;
  };

  // delete a food item of specified restaurant
  deleteFoodItem = async (id: string, slug: string) => {
    const foodItem = await prisma.foodItem.update({
      where: {
        id: id,
        restaurant: {
          slug: slug,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    return foodItem;
  };
}

export default new FoodItemService();
