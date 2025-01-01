import prisma from "../prisma/client";
import { CreateUserDto, UpdatePasswordDto } from "../dto/user.dto";
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";

class UserServices {
  // create new user also manage the owner and admin
  createUser = async (data: CreateUserDto) => {
    let user;
    const hashedPassword = crypto
      .createHash("sha1")
      .update(data.password)
      .digest("hex");
    if (data.role === "owner") {
      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: data.role,
          owner: {
            create: {
              restaurant: {
                create: {
                  name: data.owner?.restaurant.name ?? "",
                  slug: data.owner?.restaurant.slug ?? "",
                  location: data.owner?.restaurant.location ?? "",
                  description: data.owner?.restaurant.description ?? "",
                  isOpen: false,
                },
              },
            },
          },
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: data.role,
          admin: {
            create: {},
          },
        },
      });
    }
    return user;
  };

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
      throw new Error("User not found");
    }
    if (user.password !== hashedPassword) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as Secret
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
      throw new Error("User not found");
    }

    // check if the current password matches the provided password
    if (
      data.password &&
      user.password !==
        crypto.createHash("sha256").update(data.password).digest("hex")
    ) {
      throw new Error("Invalid current password");
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
      throw new Error("User not found");
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
      throw new Error("User not found");
    }
    return user;
  };
}

export default UserServices;
