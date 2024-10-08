// express
import { Router } from "express";

// Controller
import FoodItemController from "../controllers/foodController";

const foodRouter = Router();

const {
  createFoodItem,
  getAllFoodItems,
  getFoodItemById,
  deleteFoodItem,
  updateFoodItem,
  updateFoodItemStatus,
} = FoodItemController;

// create food item
foodRouter.post("/", createFoodItem);

// get all food items
foodRouter.get("/", getAllFoodItems);

// get food item by id
foodRouter.get("/:id", getFoodItemById);

// delete food item by id
foodRouter.delete("/:id", deleteFoodItem);

// update food item by id
foodRouter.put("/:id", updateFoodItem);

// update food item by status
foodRouter.patch("/:id", updateFoodItemStatus);

export default foodRouter;
