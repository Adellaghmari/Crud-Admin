import { CustomerStatus, Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).default("LEAD"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

const emptyToUndefined = (v: unknown) => (v === "" || v == null || v === undefined ? undefined : v);

export const customerQuerySchema = z.object({
  page: z.preprocess(
    (v) => (v === "" || v == null || v === undefined ? undefined : v),
    z.coerce.number().int().min(1).default(1),
  ),
  pageSize: z.preprocess(
    (v) => (v === "" || v == null || v === undefined ? undefined : v),
    z.coerce.number().int().min(1).max(50).default(10),
  ),
  search: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(200).optional(),
  ),
  status: z.preprocess(
    (v) => emptyToUndefined(v),
    z.enum(["LEAD", "ACTIVE", "INACTIVE"]).optional(),
  ),
  sortOrder: z.preprocess(
    (v) => (v === "" || v == null || v === undefined ? undefined : v),
    z.enum(["asc", "desc"]).default("desc"),
  ),
});

export const createCustomer = async (payload: z.infer<typeof customerSchema>) => {
  return prisma.customer.create({
    data: {
      ...payload,
      email: payload.email.toLowerCase(),
      phone: payload.phone || null,
      notes: payload.notes || null,
      status: payload.status as CustomerStatus,
    },
  });
};

export const getCustomers = async (rawQuery: unknown) => {
  const query = customerQuerySchema.parse(rawQuery);
  const { page, pageSize, search, status, sortOrder } = query;
  const where: Prisma.CustomerWhereInput = {
    ...(status ? { status: status as CustomerStatus } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: sortOrder },
      include: {
        _count: {
          select: { deals: true },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
    },
  };
};

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { deals: true },
  });
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }
  return customer;
};

export const updateCustomer = async (id: string, payload: z.infer<typeof customerSchema>) => {
  await getCustomerById(id);
  return prisma.customer.update({
    where: { id },
    data: {
      ...payload,
      email: payload.email.toLowerCase(),
      phone: payload.phone || null,
      notes: payload.notes || null,
      status: payload.status as CustomerStatus,
    },
  });
};

export const deleteCustomer = async (id: string) => {
  await getCustomerById(id);
  await prisma.customer.delete({ where: { id } });
};
