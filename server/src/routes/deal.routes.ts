import { Router } from "express";
import {
  createDealController,
  deleteDealController,
  getDealsController,
  updateDealController,
} from "../controllers/deal.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { idParamSchema, validate } from "../middleware/validate.js";
import { dealSchema } from "../services/deal.service.js";

export const dealRouter = Router();

dealRouter.use(requireAuth);

dealRouter.get("/", getDealsController);
dealRouter.post("/", requireRole("ADMIN"), validate({ body: dealSchema }), createDealController);
dealRouter.put(
  "/:id",
  requireRole("ADMIN"),
  validate({ params: idParamSchema, body: dealSchema }),
  updateDealController,
);
dealRouter.delete("/:id", requireRole("ADMIN"), validate({ params: idParamSchema }), deleteDealController);
