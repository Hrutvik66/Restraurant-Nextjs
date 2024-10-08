import { Router, Request, Response } from "express";

const testRouter = Router();

testRouter.get("/", (req: Request, res: Response) => {
  res.send("Testing route if it works or not");
});

export default testRouter;
