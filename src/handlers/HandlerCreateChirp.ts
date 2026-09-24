import { Request, Response, NextFunction } from "express";
import { createChirp } from "../db/queries/chirps.js";
import { BadRequestError } from "./BadRequestError.js";
import { getBearerToken, validateJWT } from "../db/queries/auth.js";
export async function handlerCreateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let { body } = req.body;

  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    return;
  }
  const token = getBearerToken(req);
  const userId = validateJWT(token, secret);
  if (body.length > 140) {
    const err = new BadRequestError("Chirp is too long. Max length is 140");
    next(err);
  }
  body = body.replace(/(kerfuffle|sharbert|fornax)(?!!)/gi, "****");
  const newChirp = await createChirp({ body, userId });
  // console.log(newChirp);
  res.status(201).json(newChirp);
}
