import { z } from "zod";

// Validación perezosa: sólo se valida al primer uso, no al importar el módulo,
// para que el servidor pueda arrancar aunque falten variables de entorno.
const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  // Origen permitido para CORS, configurable en producción sin tocar código.
  FRONTEND_URL: z.string().min(1).default("http://localhost:4200"),
});

export interface Env {
  jwtSecret: string;
  dbUser: string;
  dbHost: string;
  dbName: string;
  dbPassword: string;
  dbPort: number;
  frontendUrl: string;
}

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const invalidVars = parsed.error.issues.map((issue) => issue.path.join("."));
    throw new Error(
      `Missing or invalid environment variables: ${invalidVars.join(", ")}.`
    );
  }

  cachedEnv = {
    jwtSecret: parsed.data.JWT_SECRET,
    dbUser: parsed.data.DB_USER,
    dbHost: parsed.data.DB_HOST,
    dbName: parsed.data.DB_NAME,
    dbPassword: parsed.data.DB_PASSWORD,
    dbPort: parsed.data.DB_PORT,
    frontendUrl: parsed.data.FRONTEND_URL,
  };

  return cachedEnv;
}