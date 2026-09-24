import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "./BadRequestError.js";
import { randomUUID } from "node:crypto";
import { createUser } from "../db/queries/users.js";
import { NewUser, UserResponse } from "../db/schema.js";
import { hashPassword, makeJWT, makeRefreshToken } from "../db/queries/auth.js";
export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;
  if (!email) {
    const err = new BadRequestError("Email is required");
    next(err);
  }
  if (!password) {
    const err = new BadRequestError("Password is required");
    next(err);
  }

  const secret = process.env.TOKEN_SECRET;
  const userObject: UserResponse = {
    id: randomUUID(),
    email: email,
    createdAt: new Date(),
    updatedAt: new Date(),
    isChirpyRed: false,
  };
  const hashedPwd = await hashPassword(password);

  const result = await createUser({ ...userObject, hashedPassword: hashedPwd });
  const token = makeJWT(result.id, secret as string);
  const refreshToken = await makeRefreshToken(result.id);
  userObject.token = token;
  userObject.refreshToken = refreshToken;
  return res.status(201).json(userObject);
}
