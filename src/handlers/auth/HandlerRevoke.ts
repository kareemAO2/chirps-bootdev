import { Request, Response } from "express";
import { getBearerToken, revokeRefreshToken } from "../../db/queries/auth.js";

export async function handlerRevoke(req: Request, res: Response) {
  try {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToken(refreshToken);
    return res.status(204).send();
  } catch {
    return res.status(401).json({ error: "Refresh token required" });
  }
}
