import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { env } from "../config/env.js";
import { loginUser, registerUser } from "../services/auth.service.js";

// Cross-origin i prod: cookie behöver SameSite=none + Secure.
const crossSiteSession =
  env.NODE_ENV === "production" &&
  env.clientOrigins.some((o) => !o.startsWith("http://localhost"));

const accessTokenCookie = () => {
  const secure = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: (crossSiteSession ? "none" : "lax") as "none" | "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.cookie("accessToken", result.token, accessTokenCookie());
  res.json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({ user: req.user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    path: "/",
    httpOnly: true,
    secure: accessTokenCookie().secure,
    sameSite: accessTokenCookie().sameSite,
  });
  res.json({ message: "Utloggad" });
});
