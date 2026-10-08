import { z } from "zod";
import { getRoboflowConfig } from "../config/roboflow";
import type { RoboflowConfig } from "../config/roboflow";
import type { ClassificationResult } from "../types/waste";
import {
  LowConfidenceError,
  RoboflowConfigError,
  RoboflowTimeoutError,
  RoboflowUpstreamError,
} from "../utils/errors";

const REQUEST_TIMEOUT_MS = 10_000;

// Respuesta de la API serverless de Roboflow (clasificación de una etiqueta).
// "top" y "confidence" vienen en el endpoint de clasificación; "predictions"
// cubre variantes del mismo endpoint. El schema ignora campos extra
// (no estricto) y normaliza clase a minúsculas tras elegir la principal.
const roboflowResponseSchema = z.object({
  top: z.string().optional(),
  confidence: z.number().optional(),
  predictions: z
    .array(z.object({ class: z.string(), confidence: z.number() }))
    .optional(),
});

function extensionForMimetype(mimetype: string): string {
  switch (mimetype) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export async function classifyImage(
  imageBuffer: Buffer,
  mimetype: string,
): Promise<ClassificationResult> {
  const config = resolveConfig();

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(imageBuffer)], { type: mimetype }),
    `image.${extensionForMimetype(mimetype)}`,
  );

  let response: Response;
  try {
    response = await fetch(config.ROBOFLOW_MODEL_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.ROBOFLOW_API_KEY}` },
      body: form,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new RoboflowTimeoutError();
    }
    console.error(
      "[roboflow] request failed:",
      err instanceof Error ? err.message : "Unknown error",
    );
    throw new RoboflowUpstreamError();
  }

  if (!response.ok) {
    console.error(`[roboflow] upstream HTTP error: ${response.status}`);
    throw new RoboflowUpstreamError();
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    console.error("[roboflow] invalid JSON in response");
    throw new RoboflowUpstreamError();
  }

  const parsed = roboflowResponseSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    console.error(`[roboflow] invalid response shape: ${details}`);
    throw new RoboflowUpstreamError();
  }

  const data = parsed.data;

  let label: string | undefined;
  let confidence: number | undefined;

  if (data.top !== undefined && data.confidence !== undefined) {
    label = data.top;
    confidence = data.confidence;
  } else if (data.predictions !== undefined && data.predictions.length > 0) {
    const best = data.predictions.reduce((prev, curr) =>
      curr.confidence > prev.confidence ? curr : prev,
    );
    label = best.class;
    confidence = best.confidence;
  }

  if (label === undefined || confidence === undefined) {
    console.error("[roboflow] response missing label or confidence");
    throw new RoboflowUpstreamError();
  }

  if (confidence < config.ROBOFLOW_MIN_CONFIDENCE) {
    throw new LowConfidenceError(confidence);
  }

  return { label: label.toLowerCase(), confidence };
}

function resolveConfig(): RoboflowConfig {
  try {
    return getRoboflowConfig();
  } catch (err) {
    const details = err instanceof Error ? err.message : "Unknown error";
    console.error(`[roboflow] configuration error: ${details}`);
    throw new RoboflowConfigError();
  }
}