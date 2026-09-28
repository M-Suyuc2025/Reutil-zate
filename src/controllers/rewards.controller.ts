import type { Request, Response } from "express";
import { listRewards, redeemReward } from "../services/rewards.service";
import {
  InsufficientPointsError,
  RewardLimitExceededError,
  RewardNotFoundError,
} from "../utils/errors";

export async function getRewards(_req: Request, res: Response): Promise<void> {
  try {
    const rewards = await listRewards();
    res.status(200).json({ rewards });
  } catch (err) {
    console.error(
      "[rewards] failed to list rewards:",
      err instanceof Error ? err.message : err,
    );
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}

export async function redeemRewardHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Token Requerido." });
    return;
  }

  const rewardId = Number(req.params.id);
  if (!Number.isInteger(rewardId) || rewardId <= 0) {
    res.status(400).json({ message: "Invalid reward id." });
    return;
  }

  try {
    const result = await redeemReward(user.id, rewardId);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof RewardNotFoundError) {
      res.status(404).json({ message: err.message });
      return;
    }
    if (err instanceof RewardLimitExceededError) {
      res.status(409).json({ message: err.message });
      return;
    }
    if (err instanceof InsufficientPointsError) {
      res.status(400).json({ message: err.message });
      return;
    }

    console.error(
      "[rewards] failed to redeem reward:",
      err instanceof Error ? err.message : err,
    );
    res.status(500).json({ message: "Error en el servidor interno." });
  }
}