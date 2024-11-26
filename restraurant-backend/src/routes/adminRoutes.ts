// express
import { Router } from "express";
// controller
import AdminController from "../controllers/adminController";
// middleware
import { auth } from "../middleware/auth.middleware";

const { createAdmin, updateAdminPassword, loginAdmin, getAdminById } =
  AdminController;

const adminRouter = Router();

// create admin
adminRouter.post("/", createAdmin);
// update admin password
adminRouter.put("/password", auth, updateAdminPassword);
// login admin
adminRouter.post("/login", loginAdmin);
// get admin data
adminRouter.get("/id", auth, getAdminById);

export default adminRouter;
