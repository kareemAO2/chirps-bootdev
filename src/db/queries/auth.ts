import * as argon2 from "argon2";
import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import * as crypto from "crypto";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  const hashedPwd = await argon2.hash(password);
  return hashedPwd;
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  const verify = await argon2.verify(hash, password);
  return verify;
}

export async function checkUserByEmail(email: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result;
}

export function makeJWT(userID: string, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    { iss: "chirp", sub: userID, iat, exp: iat + 60 * 60 } as payload,
    secret,
  );
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decodedPayload = jwt.verify(tokenString, secret);
    if (typeof decodedPayload === "string" || !decodedPayload.sub) {
      throw new Error("Token is invalid");
    }
    return decodedPayload.sub;
  } catch (error) {
    const unauthorizedError = new Error("Token is invalid") as Error & {
      status: number;
    };
    unauthorizedError.status = 401;
    throw unauthorizedError;
  }
}

export function getBearerToken(req: Request): string {
  const authorization = req.headers["authorization"];
  const [scheme, token] = authorization?.split(" ") ?? [];
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    const unauthorizedError = new Error("Token required") as Error & {
      status: number;
    };
    unauthorizedError.status = 401;
    throw unauthorizedError;
  }
  return token;
}

export async function makeRefreshToken(userId: string) {
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 60);
  await db
    .insert(refreshTokens)
    .values({ token: refreshToken, userId, expiresAt });
  return refreshToken;
}

export async function validateRefreshToken(refreshToken: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken))
    .limit(1);

  if (
    !result ||
    result.revokedAt ||
    (result.expiresAt && new Date() >= result.expiresAt)
  ) {
    return false;
  }
  return true;
}

export async function getUserFromRefreshToken(refreshToken: string) {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .innerJoin(refreshTokens, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, refreshToken))
    .limit(1);
  return user;
}

export async function revokeRefreshToken(refreshToken: string) {
  const [result] = await db
    .update(refreshTokens)
    .set({ updatedAt: new Date(), revokedAt: new Date() })
    .where(eq(refreshTokens.token, refreshToken));
  return result;
}

export function getAPIKey(req: Request) {
  const authorization = req.headers["authorization"];
  const [scheme, token] = authorization?.split(" ") ?? [];
  console.log(token);
  if (scheme?.toLowerCase() !== "apikey" || !token) {
    const unauthorizedError = new Error("Token required") as Error & {
      status: number;
    };
    unauthorizedError.status = 401;
    throw unauthorizedError;
  }
  return token;
}
