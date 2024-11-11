import prisma from "../prisma/client";

class RestaurantService {
  // get all restaurants
  getAllRestaurants() {
    return prisma.restaurant.findMany({
      include: {
        foodItems: true,
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
}

export default new RestaurantService();
