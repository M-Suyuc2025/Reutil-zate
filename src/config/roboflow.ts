import { z } from "zod";

// Validación perezosa: sólo se valida al primer uso, no al importar el módulo,
// para que el servidor pueda arrancar aunque falten las variables de entorno.
const roboflowEnvSchema = z.object({
  ROBOFLOW_API_KEY: z.string().min(1),
  ROBOFLOW_MODEL_URL: z.url(),
  ROBOFLOW_MIN_CONFIDENCE: z.coerce.number().min(0).max(1).default(0.5),
});

export type RoboflowConfig = z.infer<typeof roboflowEnvSchema>;

let cachedConfig: RoboflowConfig | null = null;

export function getRoboflowConfig(): RoboflowConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const parsed = roboflowEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const invalidVars = parsed.error.issues.map((issue) => issue.path.join("."));
    throw new Error(
      `Missing or invalid Roboflow environment variables: ${invalidVars.join(", ")}.`
    );
  }

  cachedConfig = parsed.data;
  return cachedConfig;
}