import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(12),
  JWT_EXPIRES_IN: z.string().default("1d"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"), // flera: komma
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  clientOrigins: parsed.CLIENT_ORIGIN.split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
