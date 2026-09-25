import type { Request, Response } from "express";
import { getUserHistory } from "../services/history.service";

export async function getHistory(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Token Requerido." });
    return;
  }

  try {
    const history = await getUserHistory(user.id);
    res.status(200).json(history);
  } catch (err) {
    console.error(
      "[history] failed to load history:",
      err instanceof Error ? err.message : err,
    );
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}