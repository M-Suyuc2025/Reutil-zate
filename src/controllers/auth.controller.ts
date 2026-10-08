import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import { EmailAlreadyExistsError, InvalidCredentialsError } from "../utils/errors";

export async function register(req: Request, res: Response): Promise<void> {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({
      message: "Nombre, Email y Contraseña son Obligatorios.",
    });
    return;
  }

  try {
    const { user, token } = await registerUser(nombre, email, password);

    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      res.status(400).json({ message: "El correo electrónico ya existe." });
      return;
    }

    console.error("[auth] register error:", err instanceof Error ? err.message : err);
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "El correo y la contraseña son obligatorios" });
    return;
  }

  try {
    const { user, token } = await loginUser(email, password);

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
    if (err instanceof InvalidCredentialsError) {
      res.status(401).json({ message: "Credenciales inválidas." });
      return;
    }

    console.error("[auth] login error:", err instanceof Error ? err.message : err);
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}