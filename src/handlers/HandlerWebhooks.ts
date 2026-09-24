import { NextFunction, Request, Response } from "express";
import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { getAPIKey } from "../db/queries/auth.js";

export async function handlerWebhooks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      event,
      data: { userId },
    } = req.body;

    const APIKey = getAPIKey(req);
    if (APIKey !== (process.env.POLKA_KEY as string)) {
      return res.status(401).send();
    }
    if (event === "user.upgraded") {
      await upgradeUserToChirpyRed(userId);
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
