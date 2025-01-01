import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router();

const { createOwner, createAdmin, loginUser } = userController;

// Owner routes
userRouter.post("/owner/register", createOwner);

// Admin routes
userRouter.post("/admin/register", createAdmin);

// Common routes
userRouter.post("/login", loginUser);

export default userRouter;
