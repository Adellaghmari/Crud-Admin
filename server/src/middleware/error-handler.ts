import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/api-error.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error as Prisma.PrismaClientKnownRequestError).code === "P2002"
  ) {
    return res.status(409).json({ message: "Resource already exists" });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};
