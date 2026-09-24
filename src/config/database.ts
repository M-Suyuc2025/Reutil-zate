import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password
});

export async function testDataBase(): Promise<void>{
    await pool.query(`SELECT NOW()`);

    console.log(`PostgresSQL conectado`);
}