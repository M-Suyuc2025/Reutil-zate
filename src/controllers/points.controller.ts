import type { Request, Response } from "express";
import { getUserPointsSummary } from "../services/points-summary.service";

export async function getPointsSummaryHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Token Requerido." });
    return;
  }

  try {
    const summary = await getUserPointsSummary(user.id);
    res.status(200).json(summary);
  } catch (err) {
    console.error(
      "[points] failed to load summary:",
      err instanceof Error ? err.message : err,
    );
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}