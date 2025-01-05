// prisma
import prisma from "../prisma/client";
// crypto module to hash password
import crypto from "crypto";
// admin dto
import { CreateAdminDto } from "../dto/adminDto";
// dotenv
import dotenv from "dotenv";
import UserServices from "./user.services";
import CustomError from "../utils/CustomError";

dotenv.config();

class AdminService extends UserServices {
  // create a new admin
  createAdmin = async (data: CreateAdminDto) => {
    // hashing password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(data.password)
      .digest("hex");

    // check if admin already exists
    const admin = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (admin) {
      throw new CustomError("Admin already exists", 404);
    }

    // create admin in the database and return it
    const newAdmin = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "admin",
        admin: {
          create: {},
        },
      },
      include: {
        admin: true,
      },
    });
    return newAdmin;
  };
}

export default new AdminService();
