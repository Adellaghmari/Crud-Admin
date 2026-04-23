import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { customerRouter } from "./customer.routes.js";
import { dealRouter } from "./deal.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/deals", dealRouter);
