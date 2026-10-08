import { getHistoryByUserId } from "../repositories/recycling.repository";
import type { HistoryResponse } from "../types/history";

// Devuelve el historial del usuario ya listo para responder al cliente.
export async function getUserHistory(userId: number): Promise<HistoryResponse> {
  const records = await getHistoryByUserId(userId);
  return { records };
}