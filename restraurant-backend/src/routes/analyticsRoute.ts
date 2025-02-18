// routes/analyticsRoute.ts

import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController";
import { auth } from "../middleware/auth.middleware";

const analyticsRouter = Router();

analyticsRouter.get("/analytics", auth, getAnalytics);

export default analyticsRouter;
