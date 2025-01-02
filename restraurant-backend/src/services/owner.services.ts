import prisma from "../prisma/client";
// ownerDTO
import {
  OwnerCreationDto,
  OwnerUpdateDto,
} from "../dto/ownerDto";
// crypto
import crypto from "crypto";
// customError
import CustomError from "../utils/CustomError";
import UserServices from "./user.service";

class OwnerService extends UserServices {
  // create new owner and restraurant at same time
  createOwner = async (data: OwnerCreationDto) => {
    // hash password
    const hashedPassword = crypto
      .createHash("sha1")
      .update(data.password)
      .digest("hex");

    // check if owner already exists
    const owner = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (owner) {
      throw new CustomError("Owner already exists", 404);
    }

    // check if restaurant slug is unique
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: data.restaurant.slug,
      },
    });
    if (restaurant) {
      throw new CustomError("Restaurant slug already exists", 404);
    }

    const newOwner = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "owner",
        owner: {
          create: {
            restaurant: {
              create: {
                name: data.restaurant.name,
                slug: data.restaurant.slug,
                location: data.restaurant.location,
                description: data.restaurant.description,
                isOpen: false,
              },
            },
          },
        },
      },
      include: {
        owner: true,
      },
    });
    return newOwner;
  };

  // update owner and restaurant at same time
  updateOwner = async (id: string, owner: OwnerUpdateDto) => {
      //   check if owner exists
      const ownerData = await prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          owner: {
            include: {
              restaurant: true,
            },
          },
        },
      });
      if (!ownerData) {
        throw new CustomError("Owner not found", 404);
      }

      const updatedOwner = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: owner.email ?? owner.email,
          owner: {
            update: {
              restaurant: {
                update: {
                  name:
                    owner.restaurant?.name ?? ownerData.owner?.restaurant.name,
                  slug:
                    owner.restaurant?.slug ?? ownerData.owner?.restaurant.slug,
                  location:
                    owner.restaurant?.location ??
                    ownerData.owner?.restaurant?.location,
                  description:
                    owner.restaurant?.description ??
                    ownerData.owner?.restaurant?.description,
                  isOpen:
                    owner.restaurant?.isOpen ??
                    ownerData.owner?.restaurant?.isOpen,
                },
              },
            },
          },
        },
      });
      if (!updatedOwner) {
        throw new CustomError("Error updating owner", 500);
      }
      return updatedOwner;
  };

  // toggle Restaurant open
  toggleRestaurantOpen = async (isOpen: boolean, slug: string) => {
    try {
      const Restaurant = await prisma.restaurant.update({
        where: {
          slug,
        },
        data: {
          isOpen: isOpen,
        },
      });

      if (!Restaurant) {
        throw new CustomError("Restaurant not found", 404);
      }

      if (Restaurant.slug !== slug) {
        throw new CustomError("You are not a owner of this restaurant", 401);
      }
      return Restaurant;
    } catch (error) {
      throw error;
    }
  };
}

export default new OwnerService();
