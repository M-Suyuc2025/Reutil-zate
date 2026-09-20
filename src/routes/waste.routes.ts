import { Router } from "express";
import { classifyWaste } from "../controllers/waste.controller";
import { handleUploadErrors, upload } from "../middlewares/upload.middleware";

const router: Router = Router();

router.post("/classify", upload.single("image"), classifyWaste, handleUploadErrors);

export default router;