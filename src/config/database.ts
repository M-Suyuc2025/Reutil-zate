import { Pool } from "pg";
import { getEnv } from "./env";

let pool: Pool | null = null;

// Pool perezoso: se crea la primera vez que se hace una consulta, validando
// antes las variables de entorno. No impide el arranque si falta la base.
export function getPool(): Pool {
  if (!pool) {
    const { dbUser, dbHost, dbName, dbPassword, dbPort } = getEnv();
    pool = new Pool({
      user: dbUser,
      host: dbHost,
      database: dbName,
      password: dbPassword,
      port: dbPort,
    });
  }

  return pool;
}