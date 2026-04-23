import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { createDeal, deleteDeal, getDeals, updateDeal } from "../services/deal.service.js";

export const createDealController = asyncHandler(async (req: Request, res: Response) => {
  const deal = await createDeal(req.body);
  res.status(201).json(deal);
});

export const getDealsController = asyncHandler(async (_req: Request, res: Response) => {
  const deals = await getDeals();
  res.json(deals);
});

export const updateDealController = asyncHandler(async (req: Request, res: Response) => {
  const deal = await updateDeal(req.params.id as string, req.body);
  res.json(deal);
});

export const deleteDealController = asyncHandler(async (req: Request, res: Response) => {
  await deleteDeal(req.params.id as string);
  res.status(204).send();
});
