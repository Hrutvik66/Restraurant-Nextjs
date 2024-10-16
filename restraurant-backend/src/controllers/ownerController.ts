import { Request, Response } from "express";
// service
import OwnerService from "../services/ownerServices";
import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload, CustomRequest } from "../middleware/auth.middleware";

const {
  createOwner,
  updateOwner,
  getOwnerData,
  getAllOwners,
  login,
  toggleRestaurantOpen,
} = OwnerService;

class OwnerController {
  // create a new owner
  createOwner = async (req: Request, res: Response) => {
    try {
      if ((req as CustomRequest).token) {
        const { id, role } = (req as CustomRequest).token as CustomJwtPayload;
        if (role !== "admin") {
          throw new Error("Access denied");
        }
      }
      const owner = await createOwner(req.body);
      res.status(201).json(owner);
    } catch (error) {
      res.status(500).json({ message: "Failed to create owner" });
    }
  };

  // update owner and restaurant at same time
  updateOwner = async (req: Request, res: Response) => {
    try {
      if ((req as CustomRequest).token) {
        const { id, role } = (req as CustomRequest).token as CustomJwtPayload;
        if (role !== "admin") {
          throw new Error("Access denied");
        }
      }
      const updatedOwner = await updateOwner(req.params.id, req.body);
      res.status(200).json(updatedOwner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update owner" });
    }
  };

  // get owner data by id
  getOwnerData = async (req: Request, res: Response) => {
    try {
      const ownerData = await getOwnerData(req.params.id);
      res.status(200).json(ownerData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get owner data" });
    }
  };

  // get all owners
  getAllOwners = async (req: Request, res: Response) => {
    try {
      if ((req as CustomRequest).token) {
        const { id, role } = (req as CustomRequest).token as CustomJwtPayload;
        if (role !== "admin") {
          throw new Error("Access denied");
        }
      }
      const owners = await getAllOwners();
      res.status(200).json(owners);
    } catch (error) {
      res.status(500).json({ message: "Failed to get all owners" });
    }
  };

  // user login
  login = async (req: Request, res: Response) => {
    try {
      const { user, token } = await login(req.body.email, req.body.password);
      res.status(200).json({ message: "Logged in successfully", user, token });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  };

  // toggle restaurant open status
  toggleRestaurantOpen = async (req: Request, res: Response) => {
    try {
      if ((req as CustomRequest).token) {
        const { id, role } = (req as CustomRequest).token as CustomJwtPayload;
        if (role !== "owner") {
          throw new Error("Access denied");
        }
      }
      const updatedOwner = await toggleRestaurantOpen(
        req.params.id,
        req.body.isOpen
      );
      res.status(200).json(updatedOwner);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to toggle restaurant open status" });
    }
  };
}

export default new OwnerController();
