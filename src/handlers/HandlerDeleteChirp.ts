import { Request, Response } from "express";
import { getBearerToken, validateJWT } from "../db/queries/auth.js";
import { deleteChirp } from "../db/queries/chirps.js";
import { validateRole } from "../db/queries/users.js";

export async function handlerDeleteChirp(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, process.env.TOKEN_SECRET as string);

  const chirpId = req.params.chirpId as string;
  const isOwner = await validateRole(userId, chirpId);
  if (!isOwner) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!(await deleteChirp(chirpId))) {
    return res.status(404).json({ error: "Chirp not found" });
  }
  return res.status(204).send();
}
