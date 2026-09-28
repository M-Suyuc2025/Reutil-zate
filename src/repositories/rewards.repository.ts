import { getPool } from "../config/database";
import type { Reward } from "../types/rewards";
import { InsufficientPointsError } from "../utils/errors";

interface RewardRow {
  id: number;
  name: string;
  description: string | null;
  cost_points: number;
  monthly_limit: number | null;
  total_limit: number | null;
  is_active: boolean;
}

function toReward(row: RewardRow): Reward {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    costPoints: row.cost_points,
    monthlyLimit: row.monthly_limit,
    totalLimit: row.total_limit,
    isActive: row.is_active,
  };
}

export async function getActiveRewards(): Promise<Reward[]> {
  const result = await getPool().query<RewardRow>(
    `SELECT id, name, description, cost_points, monthly_limit, total_limit, is_active
     FROM rewards
     WHERE is_active = true
     ORDER BY cost_points ASC`,
  );

  return result.rows.map(toReward);
}

export async function getRewardById(id: number): Promise<Reward | null> {
  const result = await getPool().query<RewardRow>(
    `SELECT id, name, description, cost_points, monthly_limit, total_limit, is_active
     FROM rewards
     WHERE id = $1 AND is_active = true`,
    [id],
  );

  const row = result.rows[0];

  return row ? toReward(row) : null;
}

export async function countUserRedemptionsThisMonth(
  userId: number,
  rewardId: number,
): Promise<number> {
  const result = await getPool().query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM redemptions
     WHERE user_id = $1 AND reward_id = $2
       AND redeemed_at >= date_trunc('month', CURRENT_DATE)`,
    [userId, rewardId],
  );

  return result.rows[0]?.count ?? 0;
}

export async function countUserRedemptionsTotal(
  userId: number,
  rewardId: number,
): Promise<number> {
  const result = await getPool().query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM redemptions
     WHERE user_id = $1 AND reward_id = $2`,
    [userId, rewardId],
  );

  return result.rows[0]?.count ?? 0;
}

// Canjea una recompensa en una sola transacción: resta puntos al usuario e
// inserta la fila de redemptions. Devuelve el saldo restante del usuario.
export async function createRedemption(
  userId: number,
  rewardId: number,
  pointsSpent: number,
  confirmationCode: string,
): Promise<number> {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query<{ accumulated_points: number }>(
      "SELECT accumulated_points FROM users WHERE id = $1 FOR UPDATE",
      [userId],
    );
    const currentPoints = userResult.rows[0]?.accumulated_points ?? 0;

    if (currentPoints < pointsSpent) {
      throw new InsufficientPointsError(currentPoints, pointsSpent);
    }

    const remainingPoints = currentPoints - pointsSpent;

    await client.query(
      "UPDATE users SET accumulated_points = accumulated_points - $1 WHERE id = $2",
      [pointsSpent, userId],
    );

    await client.query(
      "INSERT INTO redemptions (user_id, reward_id, points_spent, confirmation_code) VALUES ($1, $2, $3, $4)",
      [userId, rewardId, pointsSpent, confirmationCode],
    );

    await client.query("COMMIT");

    return remainingPoints;
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