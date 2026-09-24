import { configObj } from "../config.js";
import { Request, Response, NextFunction } from "express";
export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  configObj.fileserverHits++;
  next();
}
