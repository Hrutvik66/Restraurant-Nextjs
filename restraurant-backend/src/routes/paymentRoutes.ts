import { Router } from "express";
// Payment Controller
import paymentController from "../controllers/paymentController";

const paymentRouter = Router();

const { initiatePayment, checkStatus, eventsHandler } = paymentController;

// SSE endpoint
paymentRouter.get("/events", eventsHandler);
// initiatePayment route
paymentRouter.post("/initiate", initiatePayment);

// checkStatus route
paymentRouter.post("/status", checkStatus);

export default paymentRouter;
