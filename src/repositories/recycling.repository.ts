import { getPool } from "../config/database";
import type { HistoryRecord } from "../types/history";

// Inserta el reciclaje y suma los puntos al usuario en una sola transacción:
// si falla cualquiera de las dos operaciones, se hace ROLLBACK de ambas.
export async function createRecyclingRecord(
  userId: number,
  materialId: number,
  pointsEarned: number,
): Promise<void> {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "INSERT INTO recycling_records (user_id, material_id, points_earned, image_url) VALUES ($1, $2, $3, NULL)",
      [userId, materialId, pointsEarned],
    );

    await client.query(
      "UPDATE users SET accumulated_points = accumulated_points + $1 WHERE id = $2",
      [pointsEarned, userId],
    );

    await client.query("COMMIT");
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Si el ROLLBACK falla, se re-lanza el error original igualmente.
    }
    throw err;
  } finally {
    client.release();
  }
}

// Historial de reciclajes del usuario, con nombre del material, de más
// reciente a más antiguo.
export async function getHistoryByUserId(
  userId: number,
): Promise<HistoryRecord[]> {
  const result = await getPool().query<{
    id: number;
    material: string;
    points_earned: number;
    created_at: Date;
  }>(
    `SELECT r.id, m.name AS material, r.points_earned, r.created_at
     FROM recycling_records r
     JOIN materials m ON m.id = r.material_id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    material: row.material,
    pointsEarned: row.points_earned,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}