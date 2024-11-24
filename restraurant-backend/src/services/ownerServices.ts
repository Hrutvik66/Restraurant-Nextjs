import prisma from "../prisma/client";
// ownerDTO
import {
  OwnerCreationDto,
  OwnerUpdateDto,
  OwnerDataDto,
} from "../dto/ownerDto";
// crypto
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";
// customError
import CustomError from "../utils/CustomError";

class OwnerService {
  // create new owner and restraurant at same time
  createOwner = async (data: any) => {
    try {
      console.log(data);

      // hash password
      const hashedPassword = crypto
        .createHash("sha1")
        .update(data.password)
        .digest("hex");
      const owner = await prisma.owner.create({
        data: {
          email: data.email,
          password: hashedPassword,
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
      });
      return owner;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create owner");
    }
  };

  // update owner and restaurant at same time
  updateOwner = async (id: string, owner: OwnerUpdateDto) => {
    try {
      //   check if owner exists
      const ownerData = await prisma.owner.findUnique({
        where: {
          id: id,
        },
        include: {
          restaurant: true,
        },
      });
      if (!ownerData) {
        throw new Error("Owner not found");
      }

      const updatedOwner = await prisma.owner.update({
        where: {
          id: id,
        },
        data: {
          email: owner.email ?? owner.email,
          restaurant: {
            update: {
              name: owner.restaurant?.name ?? ownerData.restaurant.name,
              slug: owner.restaurant?.slug ?? ownerData.restaurant.slug,
              location:
                owner.restaurant?.location ?? ownerData.restaurant?.location,
              description:
                owner.restaurant?.description ??
                ownerData.restaurant?.description,
              isOpen: owner.restaurant?.isOpen ?? ownerData.restaurant?.isOpen,
            },
          },
        },
      });
      return updatedOwner;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update owner");
    }
  };
  // get owner and restaurant data
  getOwnerData = async (id: string, slug: string) => {
    try {
      // get owner and restaurant but exclude password and id

      const ownerData = await prisma.owner.findUnique({
        where: {
          id: id,
        },
        select: {
          email: true,
          restaurant: {
            select: {
              name: true,
              slug: true,
              location: true,
              description: true,
              isOpen: true,
            },
          },
          allowService: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!ownerData) {
        throw new CustomError("Owner not found", 404);
      }

      if (ownerData.restaurant.slug !== slug) {
        throw new CustomError("You are not a owner of this restaurant", 401);
      }
      return ownerData;
    } catch (error) {
      throw error;
    }
  };

  // toggle owner service
  toggleOwnerService = async (id: string) => {
    try {
      const ownerData = await prisma.owner.findUnique({
        where: {
          id: id,
        },
      });
      if (!ownerData) {
        throw new CustomError("Owner not found", 404);
      }

      const updatedOwner = await prisma.owner.update({
        where: {
          id: id,
        },
        data: {
          allowService: !ownerData.allowService,
          restaurant: {
            update: {
              isOpen: !ownerData.allowService === false && false,
            },
          },
        },
      });
      return updatedOwner;
    } catch (error) {
      throw error;
    }
  };

  // get all owners
  getAllOwners = async () => {
    try {
      const owners = await prisma.owner.findMany({
        include: {
          restaurant: true,
        },
      });
      return owners;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all owners");
    }
  };

  // login owner
  login = async (email: string, password: string, slug: string) => {
    try {
      const owner = await prisma.owner.findUnique({
        where: {
          email: email,
        },
        include: {
          restaurant: true,
        },
      });
      if (!owner) {
        throw new CustomError("Owner not found", 404);
      }

      if (!owner.allowService) {
        throw new CustomError("Owner service is currently stopped", 403);
      }

      if (owner.restaurant.slug !== slug) {
        throw new CustomError("You are not a owner of this restaurant", 401);
      }
      const hashedPassword = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex");
      if (hashedPassword !== owner.password) {
        throw new CustomError("Invalid password", 401);
      }
      // token
      const SECRET_KEY: Secret = process.env.SECRET_KEY!;
      const token = jwt.sign({ id: owner.id, role: "owner" }, SECRET_KEY, {
        expiresIn: "7d",
      });

      const user = {
        email: owner.email,
        restaurant: {
          name: owner.restaurant.name,
          slug: owner.restaurant.slug,
          location: owner.restaurant.location,
          description: owner.restaurant.description,
          isOpen: owner.restaurant.isOpen,
        },
        allowService: owner.allowService,
        createdAt: owner.createdAt,
        updatedAt: owner.updatedAt,
      };

      return { user, token };
    } catch (error) {
      throw error;
    }
  };

  // toggle Restaurant open
  toggleRestaurantOpen = async (id: string, isOpen: boolean, slug: string) => {
    try {
      const Restaurant = await prisma.restaurant.update({
        where: {
          id: id,
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
      throw new Error("Failed to toggle restaurant open");
    }
  };
}

export default new OwnerService();
