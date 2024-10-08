// routes/analyticsRoute.ts

import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController";

const analyticsRouter = Router();

analyticsRouter.get("/analytics", getAnalytics);

export default analyticsRouter;
