import { getPointsSummary } from "../repositories/points.repository";
import type { PointsSummary } from "../types/points";

// Resumen de puntos del usuario, listo para responder.
export async function getUserPointsSummary(
  userId: number,
): Promise<PointsSummary> {
  return getPointsSummary(userId);
}