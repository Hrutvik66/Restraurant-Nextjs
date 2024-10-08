// express router
import { Router } from "express";
// user controller
import UserController from "../controllers/userController";

const userRouter = Router();

const { createUser, login } = UserController;

// create user
userRouter.post("/", createUser);

// user login
userRouter.post("/login", login);

export default userRouter;
