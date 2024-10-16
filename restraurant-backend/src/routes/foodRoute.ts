// express
import { Router } from "express";

// Controller
import FoodItemController from "../controllers/foodController";

// Middleware to authenticate requests (add token to req.body) using JWT
import { auth } from "../middleware/auth.middleware";

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
foodRouter.post("/", auth, createFoodItem);

// get all food items
foodRouter.get("/", getAllFoodItems);

// get food item by id
foodRouter.get("/:id", getFoodItemById);

// delete food item by id
foodRouter.delete("/:id", auth, deleteFoodItem);

// update food item by id
foodRouter.put("/:id", auth, updateFoodItem);

// update food item by status
foodRouter.patch("/:id", auth, updateFoodItemStatus);

export default foodRouter;
