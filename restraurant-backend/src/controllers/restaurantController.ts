// restaurant Service
import { CustomJwtPayload, CustomRequest } from "../middleware/auth.middleware";
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

  // stop restaurant service
  toggleRestaurantService = async (req: Request, res: Response) => {
    try {
      if ((req as CustomRequest).token) {
        const { id, role } = (req as CustomRequest).token as CustomJwtPayload;
        if (role !== "admin") {
          throw new Error("Access denied");
        }
      }
      const data = await restaurantServices.toggleOwnerService(req.params.id);
      res.status(200).json({
        data: data,
        message: `Owner service ${
          data.allowService === true ? "started" : "stopped"
        }`,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to stop owner service" });
    }
  };
}

export default new RestaurantController();
