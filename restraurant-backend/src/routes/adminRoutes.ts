// express
import { Router } from "express";
// controller
import AdminController from "../controllers/adminController";
// middleware
import { auth } from "../middleware/auth.middleware";

const { createAdmin, updateAdminPassword, loginAdmin, toggleOwnerService } =
  AdminController;

const adminRouter = Router();

// create admin
adminRouter.post("/", createAdmin);
// update admin password
adminRouter.put("/password", auth, updateAdminPassword);
// login admin
adminRouter.post("/login", loginAdmin);
// toggle owner service
adminRouter.patch("/:id/toogleService", auth, toggleOwnerService);

export default adminRouter;
