// prisma
import { CreateFoodItemDto, UpdateFoodItemDto } from "../dto/foodItemDto";
import prisma from "../prisma/client";
// foodItem Dto

class FoodItemService {
  // create food item
  createFoodItem = async (data: CreateFoodItemDto) => {
    const foodItem = await prisma.foodItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isListed: data.isListed,
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
