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

dotenv.config();

class AdminService {
  // create a new admin
  createAdmin = async (data: CreateAdminDto) => {
    // hashing password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(data.password)
      .digest("hex");

    // create admin in the database and return it
    const admin = await prisma.admin.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
    return admin;
  };

  // update an admin password with the new password
  updateAdminPassword = async (data: UpdateAdminPasswordDto) => {
    // check if the email exists in the database
    const admin = await prisma.admin.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    // check if the current password matches the provided password
    if (
      data.password &&
      admin.password !==
        crypto.createHash("sha256").update(data.password).digest("hex")
    ) {
      throw new Error("Invalid current password");
    }

    // hashing the new password if provided
    const hashedNewPassword =
      data.newPassword &&
      crypto.createHash("sha256").update(data.newPassword).digest("hex");

    // update the admin in the database
    const updatedAdmin = await prisma.admin.update({
      where: {
        email: data.email,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return updatedAdmin;
  };

  // get an admin by email
  getAdminByEmail = async (email: string) => {
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    return admin;
  };

  // admin login
  loginAdmin = async (email: string, password: string) => {
    const admin = await this.getAdminByEmail(email);

    if (!admin) {
      throw new Error("Admin not found");
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (admin.password !== hashedPassword) {
      throw new Error("Invalid password");
    }
    const SECRET_KEY: Secret = process.env.SECRET_KEY!;

    // create the token using JWT token
    const token = jwt.sign({ id: admin.id, role: "admin" }, SECRET_KEY, {
      expiresIn: "7d",
    });

    return { user: admin, token: token, role: "admin" };
  };

  // get admin by id
  getAdminById = async (id: string) => {
    const admin = await prisma.admin.findUnique({
      where: {
        id: id,
      },
    });
    return admin;
  };
}

export default new AdminService();
