import { Request, Response } from "express";
import {
  getBearerToken,
  hashPassword,
  validateJWT,
} from "../../db/queries/auth.js";
import { editUser } from "../../db/queries/users.js";

export async function handlerEditUser(req: Request, res: Response) {
  const token = getBearerToken(req);
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Token secret is not configured" });
  }
  const userId = validateJWT(token, secret);
  const { email, password } = req.body;

  const hashedPwd = await hashPassword(password);

  const user = await editUser(userId, email, hashedPwd);
  return res.status(200).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
