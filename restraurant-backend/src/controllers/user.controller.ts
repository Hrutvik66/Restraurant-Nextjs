// express
import { Request, Response } from "express";
// auth
import { CustomJwtPayload, CustomRequest } from "../middleware/auth.middleware";
// Custom Error
import CustomError from "../utils/CustomError";
// services
import ownerServices from "../services/owner.services";
import adminServices from "../services/admin.services";

class UserController {
  // Store connected clients for restaurant status SSE
  restaurantStatusClients: Response[] = [];

  // SSE events handler for restaurant status
  restaurantStatusEventsHandler = (req: Request, res: Response) => {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send an initial event (optional)
    res.write(`data: ${JSON.stringify({ message: "Connected to SSE" })}\n\n`);

    // Store the client connection
    this.restaurantStatusClients.push(res);

    // Remove the client when they disconnect
    req.on("close", () => {
      const index = this.restaurantStatusClients.indexOf(res);
      if (index !== -1) {
        this.restaurantStatusClients.splice(index, 1);
      }
    });
  };

  // Function to send SSE event to all clients
  sendRestaurantStatusSSEEvent = (data: any) => {
    this.restaurantStatusClients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        // Remove dead connections
        const index = this.restaurantStatusClients.indexOf(client);
        if (index !== -1) {
          this.restaurantStatusClients.splice(index, 1);
        }
      }
    });
  };

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
      const { user, token } = await ownerServices.loginUser(email, password);
      res.status(200).json({ user, token });
    } catch (error) {
      let err = error as CustomError;
      console.log(err);

      res.status(err.status).json({ message: err.message });
    }
  };

  // update user password
  updatePassword = async (req: Request, res: Response) => {
    try {
      const { password, newPassword } = req.body;
      const { id } = (req as CustomRequest).token as CustomJwtPayload;
      const updatedUser = await ownerServices.updatePassword(
        {
          password,
          newPassword,
        },
        id
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      let err = error as CustomError;
      res.status(err.status).json({ message: err.message });
    }
  };

  // toggle restaurant status
  toggleRestaurantStatus = async (req: Request, res: Response) => {
    try {
      const { id, role } = (req as CustomRequest).token as CustomJwtPayload;

      if (role !== "owner") {
        throw new CustomError("Access denied: You are not an owner", 403);
      }
      const updatedOwner = await ownerServices.toggleRestaurantStatus(
        req.body.isOpen,
        req.query.slug as string,
        id
      );

      // Send SSE event to all connected clients
      this.sendRestaurantStatusSSEEvent({
        message: `Restaurant ${req.query.slug} is now ${updatedOwner.isOpen ? "open" : "closed"}`,
        restaurant: {
          slug: updatedOwner.slug,
          isOpen: updatedOwner.isOpen,
          allowService: updatedOwner.allowService,
        },
      });

      res.status(200).json(updatedOwner);
    } catch (error) {
      let err = error as CustomError;
      res.status(err.status).json({ message: err.message });
    }
  };

  // get all owners
  getAllOwners = async (req: Request, res: Response) => {
    try {
      const { role } = (req as CustomRequest).token as CustomJwtPayload;
      if (role !== "admin") {
        throw new CustomError("Access denied: You are not an admin", 403);
      }
      const owners = await ownerServices.getAllOwners();
      res.status(200).json(owners);
    } catch (error) {
      let err = error as CustomError;
      res.status(err.status).json({ message: err.message });
    }
  };

  // get user data by id
  getUserDataById = async (req: Request, res: Response) => {
    try {
      const { id } = (req as CustomRequest).token as CustomJwtPayload;
      const user = await ownerServices.getUserDataById(id);
      res.status(200).json(user);
    } catch (error) {
      let err = error as CustomError;
      res.status(err.status).json({ message: err.message });
    }
  };
}

export default new UserController();
