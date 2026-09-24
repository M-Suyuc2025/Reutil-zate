import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

pool.connect()
    .then(client => {
        console.log('Conexión exitosa a PostgreSQL db');
        client.release();
    })
    .catch(err => console.error('Error al conectar a PostgreSQL:', err.stack));