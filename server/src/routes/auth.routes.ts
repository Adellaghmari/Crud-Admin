import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rate-limit.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, validate({ body: registerSchema }), register);
authRouter.post("/login", authRateLimiter, validate({ body: loginSchema }), login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", requireAuth, logout);
