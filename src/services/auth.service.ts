import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";
import type { User } from "../models/user.model";
import { createUser, findByEmail } from "../repositories/user.repository";
import { EmailAlreadyExistsError, InvalidCredentialsError } from "../utils/errors";

export interface AuthResult {
  user: User;
  token: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new EmailAlreadyExistsError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser(name, email, hashedPassword);

  return { user, token: signToken(user.id, user.email) };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  const user = await findByEmail(email);
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new InvalidCredentialsError();
  }

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token: signToken(user.id, user.email),
  };
}

function signToken(id: number, email: string): string {
  return jwt.sign({ id, email }, getEnv().jwtSecret, { expiresIn: "2h" });
}