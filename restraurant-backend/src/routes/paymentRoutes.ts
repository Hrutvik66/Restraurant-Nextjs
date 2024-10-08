import { Router } from "express";
// Payment Controller
import paymentController from "../controllers/paymentController";

const paymetRouter = Router();

const { initiatePayment, checkStatus } = paymentController;

// initiatePayment route
paymetRouter.post("/initiate", initiatePayment);

// checkStatus route
paymetRouter.post("/status", checkStatus);

export default paymetRouter;
