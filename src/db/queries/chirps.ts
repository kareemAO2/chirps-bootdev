import { asc, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp, users } from "../schema.js";
export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps(sort: "asc" | "desc") {
  const orderFunctions = { asc, desc };

  const result = await db
    .select()
    .from(chirps)
    .orderBy(orderFunctions[sort](chirps.createdAt));
  return result;
}

export async function getChirp(chirpId: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpId))
    .limit(1);

  return result[0];
}

export async function deleteChirp(chirpId: string) {
  const [result] = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId))
    .returning();

  if (!result) {
    return null;
  }
  return result;
}

export async function deleteChirps() {
  await db.delete(chirps);
  return;
}

export async function getAuthorChirps(authorId: string, sort: "asc" | "desc") {
  const orderFunctions = { asc, desc };

  const [author] = await db
    .select()
    .from(users)
    .where(eq(users.id, authorId))
    .limit(1);

  if (!author) {
    const error = new Error("User not found") as Error & { status: number };
    error.status = 404;
    throw error;
  }

  return await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId))
    .orderBy(orderFunctions[sort](chirps.createdAt));
}
