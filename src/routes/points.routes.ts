import { Router } from "express";
import { getPointsSummaryHandler } from "../controllers/points.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/summary", authenticate, getPointsSummaryHandler);

export default router;