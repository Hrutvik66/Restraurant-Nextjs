// foodController.ts

// express
import { Request, Response } from "express";
// foodService
import FoodItemService from "../services/foodServices";

const {
  checkRequestAuthentication,
  createFoodItem,
  getAllFoodItems,
  getFoodItemById,
  deleteFoodItem,
  updateFoodItem,
  updateFoodItemStatus,
} = FoodItemService;

class FoodItemController {
  createFoodItem = async (req: Request, res: Response) => {
    try {
      checkRequestAuthentication(req, res);
      const foodItem = await createFoodItem(req.body);
      res.status(201).json({
        message: "Food item created successfully",
        foodItem: foodItem,
      });
    } catch (error) {
      // update the status if access failed
      if ((error as any).message.includes("Access denied")) {
        res.status(401).json({ message: (error as any).message });
      } else {
        res.status(500).json({ message: "Failed to create food item" });
      }
    }
  };

  getAllFoodItems = async (req: Request, res: Response) => {
    try {
      const foodItems = await getAllFoodItems();
      res.status(200).json(foodItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get all food items" });
    }
  };

  getFoodItemById = async (req: Request, res: Response) => {
    try {
      const foodItem = await getFoodItemById(req.params.id);
      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }
      res.status(200).json(foodItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to get food item" });
    }
  };

  deleteFoodItem = async (req: Request, res: Response) => {
    try {
      checkRequestAuthentication(req, res);
      const foodItem = await deleteFoodItem(req.params.id);
      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }
      res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
      // update the status if access failed
      if ((error as any).message.includes("Access denied")) {
        res.status(401).json({ message: (error as any).message });
      } else {
        res.status(500).json({ message: "Failed to delete food item" });
      }
    }
  };

  updateFoodItem = async (req: Request, res: Response) => {
    try {
      checkRequestAuthentication(req, res);
      const foodItem = await getFoodItemById(req.params.id);
      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }
      const updatedFoodItem = await updateFoodItem(req.params.id, req.body);
      res.status(200).json({
        message: "Food item updated successfully",
        foodItem: updatedFoodItem,
      });
    } catch (error) {
      // update the status if access failed
      if ((error as any).message.includes("Access denied")) {
        res.status(401).json({ message: (error as any).message });
      } else {
        res.status(500).json({ message: "Failed to update food item" });
      }
    }
  };

  // update food item status
  updateFoodItemStatus = async (req: Request, res: Response) => {
    try {
      checkRequestAuthentication(req, res);
      const updatedFoodItem = await updateFoodItemStatus(
        req.params.id,
        req.body.isListed
      );
      res.status(200).json({
        message: "Food item status updated successfully",
        foodItem: updatedFoodItem,
      });
    } catch (error) {
      // update the status if access failed
      if ((error as any).message.includes("Access denied")) {
        res.status(401).json({ message: (error as any).message });
      } else {
        res.status(500).json({ message: "Failed to update food item status" });
      }
    }
  };
}

export default new FoodItemController();
