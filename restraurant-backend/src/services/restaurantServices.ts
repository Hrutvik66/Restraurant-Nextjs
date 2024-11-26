import prisma from "../prisma/client";
import CustomError from "../utils/CustomError";

class RestaurantService {
  // get all restaurants
  getAllRestaurants() {
    return prisma.restaurant.findMany({
      include: {
        foodItems: true,
        owner: true,
      },
    });
  }

  // get restaurant by slug
  getRestaurantBySlug(slug: string) {
    return prisma.restaurant.findUnique({
      where: {
        slug,
      },
      include: {
        foodItems: true,
      },
    });
  }

  // toggle owner service
  toggleOwnerService = async (id: string) => {
    try {
      const Restaurant = await prisma.restaurant.findUnique({
        where: {
          id: id,
        },
      });
      if (!Restaurant) {
        throw new CustomError("Restaurant not found", 404);
      }

      const updatedRestaurant = await prisma.restaurant.update({
        where: {
          id: id,
        },
        data: {
          allowService: !Restaurant.allowService,
          isOpen: !Restaurant.allowService === false && false,
        },
      });
      return updatedRestaurant;
    } catch (error) {
      throw error;
    }
  };
}

export default new RestaurantService();
