// Express
import { Router } from "express";
// Controller
import restaurantController from "../controllers/restaurantController";
import { auth } from "../middleware/auth.middleware";

const { getRestaurants, getRestaurantBySlug, toggleRestaurantService } =
  restaurantController;

const restaurantRouter = Router();

// get all restaurants
restaurantRouter.get("/", getRestaurants);

// get restaurant by slug
restaurantRouter.get("/:slug", getRestaurantBySlug);
// toggle owner service
restaurantRouter.patch("/:id/toogleService", auth, toggleRestaurantService);

export default restaurantRouter;
