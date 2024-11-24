// express
import { Request, Response } from "express";
// adminService
import AdminService from "../services/adminServices";
// auth
import { CustomRequest, CustomJwtPayload } from "../middleware/auth.middleware";
// import ownerService
import OwnerService from "../services/ownerServices";

const { createAdmin, updateAdminPassword, loginAdmin } = AdminService;

// Error interface
interface Error {
  message: string;
}
class AdminController {
  // create a new admin
  createAdmin = async (req: Request, res: Response) => {
    try {
      const admin = await createAdmin(req.body);
      res.status(201).json(admin);
    } catch (error: unknown) {
      const e = error as Error;
      res.status(400).json({ error: e.message });
    }
  };

  // update an admin password
  updateAdminPassword = async (req: Request, res: Response) => {
    try {
      const updatedAdmin = await updateAdminPassword(req.body);
      res.status(200).json(updatedAdmin);
    } catch (error: unknown) {
      const e = error as Error;
      res.status(400).json({ error: e.message });
    }
  };

  // login admin
  loginAdmin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await loginAdmin(email, password);
      res.status(200).json({ user, token });
    } catch (error: unknown) {
      const e = error as Error;
      res.status(400).json({ error: e.message });
    }
  };

  // stop owner service
  toggleOwnerService = async (req: Request, res: Response) => {
    try {
      if ((req as CustomRequest).token) {
        const { id, role } = (req as CustomRequest).token as CustomJwtPayload;
        if (role !== "admin") {
          throw new Error("Access denied");
        }
      }
      const data = await OwnerService.toggleOwnerService(req.params.id);
      res
        .status(200)
        .json({
          data: data,
          message: `Owner service ${
            data.allowService === true ? "started" : "stopped"
          }`,
        });
    } catch (error) {
      res.status(500).json({ message: "Failed to stop owner service" });
    }
  };
}

export default new AdminController();
