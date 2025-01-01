//services/adminService

// prisma
import prisma from "../prisma/client";
// crypto module to hash password
import crypto from "crypto";
// admin dto
import {
  CreateAdminDto,
  UpdateAdminPasswordDto,
  AdminDto,
} from "../dto/adminDto";
// jwt
import jwt, { Secret } from "jsonwebtoken";
// dotenv
import dotenv from "dotenv";
import UserServices from "./user.service";

dotenv.config();

class AdminService extends UserServices {
  // create a new admin
  createAdmin = async (data: CreateAdminDto) => {
    try {
      // hashing password
      const hashedPassword = crypto
        .createHash("sha256")
        .update(data.password)
        .digest("hex");

      // create admin in the database and return it
      const admin = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "admin",
          admin: {},
        },
        include: {
          admin: true,
        },
      });
      return admin;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create admin");
    }
  };
}

export default new AdminService();
