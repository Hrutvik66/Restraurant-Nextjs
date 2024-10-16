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

interface CustomError extends Error {
  message: string;
}

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
  getOwnerData = async (id: string) => {
    try {
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
      return ownerData;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get owner data");
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
        throw new Error("Owner not found");
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
      console.error(error);
      throw new Error("Failed to toggle owner service");
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
  login = async (email: string, password: string) => {
    try {
      const owner = await prisma.owner.findUnique({
        where: {
          email: email,
        },
      });
      if (!owner) {
        throw new Error("Owner not found");
      }

      if (!owner.allowService) {
        throw new Error("Owner service is currently stopped");
      }
      const hashedPassword = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex");
      if (hashedPassword !== owner.password) {
        throw new Error("Invalid password");
      }
      // token
      const SECRET_KEY: Secret = process.env.SECRET_KEY!;
      const token = jwt.sign({ id: owner.id, role: "owner" }, SECRET_KEY, {
        expiresIn: "7d",
      });
      return { user: owner, token };
    } catch (error) {
      throw error;
    }
  };

  // toggle Restaurant open
  toggleRestaurantOpen = async (id: string, isOpen: boolean) => {
    try {
      const Restaurant = await prisma.restaurant.update({
        where: {
          id: id,
        },
        data: {
          isOpen: isOpen,
        },
      });
      return Restaurant;
    } catch (error) {
      throw new Error("Failed to toggle restaurant open");
    }
  };
}

export default new OwnerService();
