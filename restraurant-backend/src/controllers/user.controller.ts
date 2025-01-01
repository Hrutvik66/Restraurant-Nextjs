// express
import { Request, Response } from "express";
// auth
import { CustomJwtPayload, CustomRequest } from "../middleware/auth.middleware";
// Custom Error
import CustomError from "../utils/CustomError";
// services
import ownerServices from "../services/ownerServices";
import adminServices from "../services/adminServices";

class UserController {
  //   create owner
  createOwner = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const owner = await ownerServices.createOwner(data);
      res.status(201).json(owner);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  // create admin
  createAdmin = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const admin = await adminServices.createAdmin(data);
      res.status(201).json(admin);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  // login user
  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await ownerServices.loginUser(email, password);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };

  // update user password
  updatePassword = async (req: Request, res: Response) => {
    try {
      const { email, password, newPassword } = req.body;
      const updatedUser = await ownerServices.updatePassword({
        email,
        password,
        newPassword,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
}

export default new UserController();
