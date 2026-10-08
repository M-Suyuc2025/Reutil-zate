import { Router } from "express";
import { getHistory } from "../controllers/history.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/history", authenticate, getHistory);

export default router;