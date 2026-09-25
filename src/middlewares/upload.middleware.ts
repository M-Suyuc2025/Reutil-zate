import type { NextFunction, Request, Response } from "express";
import multer from "multer";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

class InvalidFileTypeError extends Error {
  constructor() {
    super("Invalid file type. Only image/jpeg, image/png and image/webp are allowed.");
    this.name = "InvalidFileTypeError";
  }
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new InvalidFileTypeError());
    }
  },
});

export function handleUploadErrors(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "File too large. Maximum size is 5 MB." });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof InvalidFileTypeError) {
    res.status(400).json({ error: err.message });
    return;
  }

  next(err);
}