// Express
import { Router } from "express";
// Controller
import restaurantController from "../controllers/restaurantController";

const { getRestaurants, getRestaurantBySlug } = restaurantController;

const restaurantRouter = Router();

// get all restaurants
restaurantRouter.get("/", getRestaurants);

// get restaurant by slug
restaurantRouter.get("/:slug", getRestaurantBySlug);

export default restaurantRouter;
