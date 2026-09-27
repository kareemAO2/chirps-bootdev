import { NextFunction, Request, Response } from "express";
import {
  checkPasswordHash,
  checkUserByEmail,
  makeJWT,
  makeRefreshToken,
} from "../../db/queries/auth.js";
import { UserResponse } from "../../db/schema.js";
export async function handlerLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const { hashedPassword, ...result } = await checkUserByEmail(email);
    if (!result) {
      return res
        .status(404)
        .json({ message: "User with this email dones't exist" });
    }
    const checkPwd = await checkPasswordHash(password, hashedPassword);
    if (!checkPwd) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const secret = process.env.TOKEN_SECRET;
    if (!secret) return;

    const token = makeJWT(result.id, secret);
    const refreshToken = await makeRefreshToken(result.id);
    const userObject: UserResponse = { ...result, token, refreshToken };
    res.status(200).json(userObject);
  } catch (err) {
    next({ message: "" });
  }
}
