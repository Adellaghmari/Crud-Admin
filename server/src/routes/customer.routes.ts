import { Router } from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getCustomerController,
  getCustomersController,
  updateCustomerController,
} from "../controllers/customer.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { idParamSchema, validate } from "../middleware/validate.js";
import { customerSchema } from "../services/customer.service.js";

export const customerRouter = Router();

customerRouter.use(requireAuth);

customerRouter.get("/", getCustomersController);
customerRouter.get("/:id", validate({ params: idParamSchema }), getCustomerController);
customerRouter.post("/", requireRole("ADMIN"), validate({ body: customerSchema }), createCustomerController);
customerRouter.put(
  "/:id",
  requireRole("ADMIN"),
  validate({ params: idParamSchema, body: customerSchema }),
  updateCustomerController,
);
customerRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  validate({ params: idParamSchema }),
  deleteCustomerController,
);
