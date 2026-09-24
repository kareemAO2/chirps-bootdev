import { configObj } from "../config.js";
import { Request, Response } from "express";
import { deleteUsers } from "../db/queries/users.js";
import { deleteChirps } from "../db/queries/chirps.js";
export function hitsHandler(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits: ${configObj.fileserverHits}`);
}

export async function hitsReset(req: Request, res: Response) {
  configObj.fileserverHits = 0;
  if (configObj.api.PLATFORM !== "dev") {
    return res.status(403).json("403 Forbidden");
  }
  await deleteChirps();
  await deleteUsers();
  return res.status(200).send();
}
