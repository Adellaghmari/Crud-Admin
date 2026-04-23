import { NextFunction, Request, Response } from "express";
import { z, ZodTypeAny } from "zod";

type ValidationSchema = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validate = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params) as Request["params"];
    }
    if (schema.query) {
      const parsed = schema.query.parse(req.query);
      Object.defineProperty(req, "query", {
        value: parsed,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    next();
  };
};

export const idParamSchema = z.object({
  id: z.string().cuid(),
});
