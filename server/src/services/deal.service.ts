import { DealPriority, DealStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const dealSchema = z.object({
  customerId: z.string().cuid(),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["OPEN", "IN_PROGRESS", "WON", "LOST"]).default("OPEN"),
});

export const createDeal = async (payload: z.infer<typeof dealSchema>) => {
  return prisma.deal.create({
    data: {
      ...payload,
      priority: payload.priority as DealPriority,
      status: payload.status as DealStatus,
      description: payload.description || null,
    },
  });
};

export const getDeals = async () => {
  return prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const updateDeal = async (id: string, payload: z.infer<typeof dealSchema>) => {
  const existing = await prisma.deal.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, "Deal not found");
  }
  return prisma.deal.update({
    where: { id },
    data: {
      ...payload,
      priority: payload.priority as DealPriority,
      status: payload.status as DealStatus,
      description: payload.description || null,
    },
  });
};

export const deleteDeal = async (id: string) => {
  const existing = await prisma.deal.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, "Deal not found");
  }
  await prisma.deal.delete({ where: { id } });
};
