import { Router } from "express";
import {
  getRewards,
  redeemRewardHandler,
} from "../controllers/rewards.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", getRewards);
router.post("/:id/redeem", authenticate, redeemRewardHandler);

export default router;