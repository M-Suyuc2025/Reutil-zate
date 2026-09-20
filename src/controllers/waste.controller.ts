import type { Request, Response } from "express";
import type { ImageMetadata } from "../types/waste";

export function classifyWaste(req: Request, res: Response): void {
  if (!req.file) {
    res.status(400).json({ error: "Missing file: expected a field named 'image'." });
    return;
  }

  const metadata: ImageMetadata = {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    sizeBytes: req.file.size,
  };

  res.status(200).json(metadata);
}