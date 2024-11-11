// restaurant Service
import restaurantServices from "../services/restaurantServices";
// Express
import { Request, Response } from "express";

const { getAllRestaurants, getRestaurantBySlug } = restaurantServices;

class RestaurantController {
  async getRestaurants(req: Request, res: Response) {
    try {
      const restaurants = await getAllRestaurants();
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Error getting restaurant" });
    }
  }

  async getRestaurantBySlug(req: Request, res: Response) {
    try {
      const slug = req.params?.slug;
      const restaurant = await getRestaurantBySlug(slug);
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ error: "Error getting restaurant" });
    }
  }
}

export default new RestaurantController();
