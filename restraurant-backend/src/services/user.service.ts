import prisma from "../prisma/client";
import { UpdatePasswordDto } from "../dto/user.dto";
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import CustomError from "../utils/CustomError";

class UserServices {
  // login user
  loginUser = async (email: string, password: string) => {
    const hashedPassword = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex");
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        owner: true,
        admin: true,
      },
    });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (user.password !== hashedPassword) {
      throw new CustomError("Invalid password", 401);
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY as Secret
    );
    return { user, token };
  };

  // update an user password with the new password
  updatePassword = async (data: UpdatePasswordDto) => {
    // check if the email exists in the database
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // check if the current password matches the provided password
    if (
      data.password &&
      user.password !==
        crypto.createHash("sha256").update(data.password).digest("hex")
    ) {
      throw new CustomError("Invalid current password", 401);
    }

    // hashing the new password if provided
    const hashedNewPassword =
      data.newPassword &&
      crypto.createHash("sha256").update(data.newPassword).digest("hex");

    // update the admin in the database
    const updatedUser = await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    if (!updatedUser) {
      throw new CustomError("Error updating user", 404);
    }

    return updatedUser;
  };

  // get user data by id
  getUserData = async (id: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        owner: {
          include: {
            restaurant: true,
          },
        },
        admin: true,
      },
    });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  };

  // get user data by email
  getUserDataByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        owner: {
          include: {
            restaurant: true,
          },
        },
        admin: true,
      },
    });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  };
}

export default UserServices;
