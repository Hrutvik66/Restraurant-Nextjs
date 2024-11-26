// express
import { Request, Response } from "express";
// adminService
import AdminService from "../services/adminServices";
// auth
import { CustomRequest, CustomJwtPayload } from "../middleware/auth.middleware";
// import ownerService
import OwnerService from "../services/ownerServices";

const { createAdmin, updateAdminPassword, loginAdmin, getAdminById } =
  AdminService;

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
      const { user, token, role } = await loginAdmin(email, password);
      res.status(200).json({ user, token, role });
    } catch (error: unknown) {
      const e = error as Error;
      res.status(400).json({ error: e.message });
    }
  };

  // get admin by id
  getAdminById = async (req: Request, res: Response) => {
    try {
      let id, role;
      if ((req as CustomRequest).token) {
        id = ((req as CustomRequest).token as CustomJwtPayload).id;
        role = ((req as CustomRequest).token as CustomJwtPayload).role;
        if (role !== "admin") {
          throw new Error("Access denied");
        }
      }
      const admin = await getAdminById(id as string);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(200).json(admin);
    } catch (error: unknown) {
      const e = error as Error;
      res.status(500).json({ error: e.message });
    }
  };
}

export default new AdminController();
