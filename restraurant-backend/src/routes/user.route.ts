import { Router } from "express";
import userController from "../controllers/user.controller";
import { auth } from "../middleware/auth.middleware";

const userRouter = Router();

const {
  createOwner,
  createAdmin,
  loginUser,
  updatePassword,
  toggleRestaurantStatus,
  getAllOwners,
  getUserDataById,
} = userController;

// Owner routes
userRouter.post("/owner/register", createOwner);

// Admin routes
userRouter.post("/admin/register", createAdmin);

// Common routes
userRouter.post("/login", loginUser);

// update password
userRouter.put("/update-password", auth, updatePassword);

// toggle restaurant open status
userRouter.patch(
  "/owner/toggle-restaurant-status",
  auth,
  toggleRestaurantStatus
);

// get all owners
userRouter.get("/admin/owners", auth, getAllOwners);

// get user data by id
userRouter.get("/:id", auth, getUserDataById);

export default userRouter;
