import type { Request, Response } from "express";
import { classifyImage } from "../services/roboflow.service";
import type {
  ClassificationResponse,
  ClassificationResult,
  ImageMetadata,
} from "../types/waste";
import { HttpError, LowConfidenceError } from "../utils/errors";

export async function classifyWaste(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: "Missing file: expected a field named 'image'." });
    return;
  }

  let classification: ClassificationResult;
  try {
    classification = await classifyImage(req.file.buffer, req.file.mimetype);
  } catch (err) {
    if (err instanceof LowConfidenceError) {
      res.status(err.statusCode).json({ error: err.message, confidence: err.confidence });
      return;
    }
    if (err instanceof HttpError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error("[waste] unexpected classification error:", err);
    res.status(500).json({ error: "Internal server error." });
    return;
  }

  const image: ImageMetadata = {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    sizeBytes: req.file.size,
  };

  const body: ClassificationResponse = {
    material: classification.label,
    confidence: classification.confidence,
    image,
  };

  res.status(200).json(body);
}