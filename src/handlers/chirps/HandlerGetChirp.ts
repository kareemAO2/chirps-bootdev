import { Request, Response, NextFunction } from "express";

import { getChirp } from "../../db/queries/chirps.js";
export async function handlerGetChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const chirpId = req.params.chirpId;
  if (!chirpId) {
    res.status(400).json({ error: "Chirp ID is required" });
    return;
  }

  const chirp = await getChirp(chirpId as string);
  if (!chirp) {
    res.status(404).json({ error: "Chirp not found" });
    return;
  }
  return res.status(200).json(chirp);
}
