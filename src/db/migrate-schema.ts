import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { getPool } from "../config/database";

dotenv.config();

async function main(): Promise<void> {
  const schemaPath = resolve(__dirname, "../../database/schema.sql");
  const sql = readFileSync(schemaPath, "utf8");

  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

  const pool = getPool();

  try {
    for (const statement of statements) {
      await pool.query(statement);
    }
    console.log(
      `Migrate: applied ${statements.length} statement(s) from database/schema.sql.`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(
    "[migrate] schema migration failed:",
    err instanceof Error ? err.message : err,
  );
  process.exitCode = 1;
});