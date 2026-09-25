import { getPool } from "../config/database";
import type { User, UserWithPassword } from "../models/user.model";

export async function findByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  const result = await getPool().query<UserWithPassword>(
    "SELECT id, name, email, password FROM users WHERE email = $1",
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string,
): Promise<User> {
  const result = await getPool().query<User>(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("createUser: no row returned.");
  }

  return row;
}