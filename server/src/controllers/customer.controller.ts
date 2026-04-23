import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../services/customer.service.js";

export const createCustomerController = asyncHandler(async (req: Request, res: Response) => {
  const customer = await createCustomer(req.body);
  res.status(201).json(customer);
});

export const getCustomersController = asyncHandler(async (req: Request, res: Response) => {
  const data = await getCustomers(req.query);
  res.json(data);
});

export const getCustomerController = asyncHandler(async (req: Request, res: Response) => {
  const customer = await getCustomerById(req.params.id as string);
  res.json(customer);
});

export const updateCustomerController = asyncHandler(async (req: Request, res: Response) => {
  const customer = await updateCustomer(req.params.id as string, req.body);
  res.json(customer);
});

export const deleteCustomerController = asyncHandler(async (req: Request, res: Response) => {
  await deleteCustomer(req.params.id as string);
  res.status(204).send();
});
