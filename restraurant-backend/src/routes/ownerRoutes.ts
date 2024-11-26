// router
import { Router } from "express";
// controller
import OwnerController from "../controllers/ownerController";
import { auth } from "../middleware/auth.middleware";

const {
  createOwner,
  getOwnerData,
  getAllOwners,
  updateOwner,
  login,
  toggleRestaurantOpen,
} = OwnerController;

const ownerRouter = Router();

// create owner
ownerRouter.post("/", auth, createOwner);
// get owner data by id
ownerRouter.get("/id", auth, getOwnerData);
// get all owners
ownerRouter.get("/", auth, getAllOwners);
// update owner
ownerRouter.put("/:id", auth, updateOwner);
// login owner
ownerRouter.post("/login", login);
// toggle restaurant open status
ownerRouter.patch("/toggle", auth, toggleRestaurantOpen);

export default ownerRouter;
