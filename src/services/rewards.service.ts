import {
  countUserRedemptionsThisMonth,
  countUserRedemptionsTotal,
  createRedemption,
  getActiveRewards,
  getRewardById,
} from "../repositories/rewards.repository";
import type { Reward } from "../types/rewards";
import { generateConfirmationCode } from "../utils/confirmation-code";
import {
  isUniqueViolation,
  RewardLimitExceededError,
  RewardNotFoundError,
} from "../utils/errors";

export interface RedemptionResult {
  confirmationCode: string;
  pointsSpent: number;
  remainingPoints: number;
}

export async function listRewards(): Promise<Reward[]> {
  return getActiveRewards();
}

export async function redeemReward(
  userId: number,
  rewardId: number,
): Promise<RedemptionResult> {
  const reward = await getRewardById(rewardId);
  if (!reward) {
    throw new RewardNotFoundError(rewardId);
  }

  if (reward.monthlyLimit !== null) {
    const count = await countUserRedemptionsThisMonth(userId, rewardId);
    if (count >= reward.monthlyLimit) {
      throw new RewardLimitExceededError("monthly", reward.monthlyLimit, count);
    }
  }

  if (reward.totalLimit !== null) {
    const count = await countUserRedemptionsTotal(userId, rewardId);
    if (count >= reward.totalLimit) {
      throw new RewardLimitExceededError("total", reward.totalLimit, count);
    }
  }

  const confirmationCode = generateConfirmationCode();
  try {
    const remainingPoints = await createRedemption(
      userId,
      rewardId,
      reward.costPoints,
      confirmationCode,
    );

    return { confirmationCode, pointsSpent: reward.costPoints, remainingPoints };
  } catch (err) {
    if (isUniqueViolation(err)) {
      // Conflicto de confirmation_code (improbable): se reintenta una vez.
      const retryCode = generateConfirmationCode();
      const remainingPoints = await createRedemption(
        userId,
        rewardId,
        reward.costPoints,
        retryCode,
      );

      return { confirmationCode: retryCode, pointsSpent: reward.costPoints, remainingPoints };
    }
    throw err;
  }
}