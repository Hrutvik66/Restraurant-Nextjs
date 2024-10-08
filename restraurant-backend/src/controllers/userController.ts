import { Request, Response } from "express";
import UserService from "../services/userServices";

// bcrypt
import bcrypt from "bcrypt";

const { createUser, getAllUsers, getUserByEmail } = UserService;

class UserController {
  // create a new user
  createUser = async (req: Request, res: Response) => {
    try {
      const user = await createUser(req.body);
      res
        .status(201)
        .json({ message: "User created successfully", user: user });
    } catch (error) {
      res.status(500).json((error as any).message);
    }
  };

  // get all users
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to get all users" });
    }
  };

  // user login
  login = async (req: Request, res: Response) => {
    try {
      const user = await getUserByEmail(req.body.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // compare hashed passwords
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ message: "User logged in successfully", user: user });
    } catch (error) {}
  };
}

export default new UserController();
