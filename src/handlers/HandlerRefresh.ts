import { Request, Response } from "express";
import {
  getBearerToken,
  getUserFromRefreshToken,
  makeJWT,
  validateRefreshToken,
} from "../db/queries/auth.js";

export async function handlerRefresh(req: Request, res: Response) {
  try {
    const refreshToken = getBearerToken(req);
    if (!(await validateRefreshToken(refreshToken))) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await getUserFromRefreshToken(refreshToken);
    const secret = process.env.TOKEN_SECRET;
    if (!user || !secret) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newToken = makeJWT(user.id, secret);
    return res.status(200).json({ token: newToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}
