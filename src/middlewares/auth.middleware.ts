import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";
import type { AuthUser } from "../types/auth";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;
  const [type, token] = authorization?.split(" ") ?? [];

  if (type !== "Bearer" || !token) {
    res.status(401).json({ message: "Token Requerido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, getEnv().jwtSecret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({ message: "Token Inválido o Vencido." });
      return;
    }

    const user: AuthUser = { id: decoded.id, email: decoded.email };
    req.user = user;

    next();
  } catch (err) {
    console.error("[auth] token verification failed:", err);
    res.status(401).json({ message: "Token Inválido o Vencido." });
  }
}