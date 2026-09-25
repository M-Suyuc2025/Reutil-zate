import type { Request, Response } from "express";
import { getMaterialIdByName } from "../repositories/materials.repository";
import { createRecyclingRecord } from "../repositories/recycling.repository";
import { calculatePointsForMaterial } from "../services/points.service";
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

  let pointsEarned: number;
  try {
    pointsEarned = await calculatePointsForMaterial(classification.label);
  } catch (err) {
    // No debería ocurrir (Roboflow solo devuelve las 6 clases con puntos),
    // pero se cubre por completitud: 500 genérico + detalle en el log.
    console.error(
      "[waste] no points mapping for material:",
      err instanceof Error ? err.message : err,
    );
    res.status(500).json({ error: "Internal server error." });
    return;
  }

  let saved = false;

  if (req.user) {
    try {
      const materialId = await getMaterialIdByName(classification.label);
      await createRecyclingRecord(req.user.id, materialId, pointsEarned);
      saved = true;
    } catch (err) {
      // La clasificación ya fue exitosa: si falla el guardado no se rompe la
      // respuesta, se responde 200 con saved: false y se loguea el error.
      console.error(
        "[waste] failed to save recycling record:",
        err instanceof Error ? err.message : err,
      );
    }
  }

  const image: ImageMetadata = {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    sizeBytes: req.file.size,
  };

  const body: ClassificationResponse = {
    material: classification.label,
    confidence: classification.confidence,
    pointsEarned,
    saved,
    image,
  };

  res.status(200).json(body);
}