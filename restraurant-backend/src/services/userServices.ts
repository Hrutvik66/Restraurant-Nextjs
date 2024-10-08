import { CreateUserDto, UpdateUserDto } from "../dto/userDto";
import prisma from "../prisma/client";

class UserServices {
  // check if user exists
  checkUser = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return !!user; // return true if user exists, false otherwise
  };

  // create a new user
  createUser = async (data: CreateUserDto) => {
    if (await this.checkUser(data.email)) {
      throw new Error("User already exists");
    }
    // const user = await prisma.user
    // return user;
  };

  // get all users
  getAllUsers = async () => {
    const users = await prisma.user.findMany({});
    return users;
  };

  // get a user by id
  getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  };

  // get a user by email
  getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  };

  // update a user
  updateUser = async (id: string, data: UpdateUserDto) => {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
    return user;
  };

  // delete a user
  deleteUser = async (id: string) => {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return user;
  };
}

export default new UserServices();
