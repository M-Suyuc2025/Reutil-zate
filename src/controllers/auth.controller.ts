import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";
import { createUser, findByEmail } from "../repositories/user.repository";

export async function register(req: Request, res: Response): Promise<void> {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({
      message: "Nombre, Email y Contraseña son Obligatorios.",
    });
    return;
  }

  try {
    const existingUser = await findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "El correo electrónico ya existe." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(nombre, email, hashedPassword);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      getEnv().jwtSecret,
      { expiresIn: "2h" },
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    console.error("[auth] register error:", err instanceof Error ? err.message : err);
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "El correo y la contraseña son obligatorios" });
      return;
    }

    const user = await findByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas." });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Credenciales inválidas." });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      getEnv().jwtSecret,
      { expiresIn: "2h" },
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("[auth] login error:", err instanceof Error ? err.message : err);
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}