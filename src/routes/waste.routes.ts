import { Router } from "express";
import { classifyWaste } from "../controllers/waste.controller";
import { optionalAuthenticate } from "../middlewares/auth.middleware";
import { handleUploadErrors, upload } from "../middlewares/upload.middleware";

const router: Router = Router();

router.post(
  "/classify",
  upload.single("image"),
  optionalAuthenticate,
  classifyWaste,
  handleUploadErrors,
);

export default router;