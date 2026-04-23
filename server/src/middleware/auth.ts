import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

type TokenPayload = {
  id: string;
  email: string;
  role: UserRole;
};

const extractToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.cookies.accessToken as string | undefined;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (_error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }
    next();
  };
};
