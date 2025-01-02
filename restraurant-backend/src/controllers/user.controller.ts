// express
import { Request, Response } from "express";
// auth
import { CustomJwtPayload, CustomRequest } from "../middleware/auth.middleware";
// Custom Error
import CustomError from "../utils/CustomError";
// services
import ownerServices from "../services/owner.services";
import adminServices from "../services/admin.service";

class UserController {
  //   create owner
  createOwner = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const owner = await ownerServices.createOwner(data);
      res.status(201).json(owner);
    } catch (error) {
      let err = error as CustomError;
      res.status(err.status).json({ message: err.message });
    }
  };

  // create admin
  createAdmin = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const admin = await adminServices.createAdmin(data);
      res.status(201).json(admin);
    } catch (error) {
      let err = error as CustomError;
      res.status(err.status).json({ message: err.message });
    }
  };

  // login user
  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const {user, token} = await ownerServices.loginUser(email, password);
      res.status(200).json({user, token});
    } catch (error) {
      let err = error as CustomError;
      console.log(err);
      
      res.status(err.status).json({ message: err.message });
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
      let err = error as CustomError;
      res.status(err.status).json({ message: err.message });
    }
  };
}

export default new UserController();
