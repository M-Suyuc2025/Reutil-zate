import { getPool } from "../config/database";
import type { PointsActivity, PointsSummary } from "../types/points";

interface EarnActivityRow {
  label: string;
  points: number;
  created_at: Date;
}

interface RedeemActivityRow {
  label: string;
  points: number;
  redeemed_at: Date;
}

// Combina reciclajes ("earn") y canjes ("redeem") del usuario, ordenados de
// más reciente a más antiguo, junto con el saldo acumulado actual.
export async function getPointsSummary(userId: number): Promise<PointsSummary> {
  const pool = getPool();

  const [earnResult, redeemResult, userResult] = await Promise.all([
    pool.query<EarnActivityRow>(
      `SELECT m.name AS label, r.points_earned AS points, r.created_at
       FROM recycling_records r
       JOIN materials m ON m.id = r.material_id
       WHERE r.user_id = $1`,
      [userId],
    ),
    pool.query<RedeemActivityRow>(
      `SELECT rw.name AS label, r.points_spent AS points, r.redeemed_at
       FROM redemptions r
       JOIN rewards rw ON rw.id = r.reward_id
       WHERE r.user_id = $1`,
      [userId],
    ),
    pool.query<{ accumulated_points: number }>(
      "SELECT accumulated_points FROM users WHERE id = $1",
      [userId],
    ),
  ]);

  const earnActivities: PointsActivity[] = earnResult.rows.map((row) => ({
    type: "earn",
    label: row.label,
    points: row.points,
    createdAt: new Date(row.created_at).toISOString(),
  }));

  const redeemActivities: PointsActivity[] = redeemResult.rows.map((row) => ({
    type: "redeem",
    label: row.label,
    points: -row.points,
    createdAt: new Date(row.redeemed_at).toISOString(),
  }));

  const activities = [...earnActivities, ...redeemActivities].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return {
    totalPoints: userResult.rows[0]?.accumulated_points ?? 0,
    activities,
  };
}