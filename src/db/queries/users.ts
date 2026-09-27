import { db } from "../index.js";
import { chirps, NewUser, users } from "../schema.js";
import { and, eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
  return;
}

export async function editUser(
  userId: string,
  email: string,
  hashedPwd: string,
) {
  const [result] = await db
    .update(users)
    .set({ email: email, hashedPassword: hashedPwd, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!result) {
    throw new Error("User doesn't exist");
  }
  return result;
}

export async function validateRole(userId: string, chirpId: string) {
  const [result] = await db
    .select({ id: chirps.id })
    .from(chirps)
    .where(eq(chirps.id, chirpId))
    .limit(1);

  if (!result) {
    return false;
  }

  const [ownedChirp] = await db
    .select({ id: chirps.id })
    .from(chirps)
    .where(and(eq(chirps.id, chirpId), eq(chirps.userId, userId)))
    .limit(1);

  return Boolean(ownedChirp);
}

export async function upgradeUserToChirpyRed(userId: string) {
  try {
    const [result] = await db
      .update(users)
      .set({ isChirpyRed: true })
      .where(eq(users.id, userId))
      .returning();
    if (!result) {
      const notFoundError = new Error("User not found") as Error & {
        status: number;
      };
      notFoundError.status = 404;
      throw notFoundError;
    }
    return result;
  } catch (err) {
    throw new Error(`${err}`);
  }
}
