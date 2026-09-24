import { pool } from "../config/database";
import { User, UserWithPassword } from "../models/user.model";

export async function findByEmail(email:string): Promise<UserWithPassword | null> {
    const result = await pool.query<UserWithPassword>(
        'SELECT id, name, email, password FROM users WHERE email = $1',
        [email]
    );

    return result.rows[0] ?? null;
}

export async function createUser(nombre:string, email: string, password: string): Promise<User> {
    const result = await pool.query<User>(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [nombre, email, password]
    );
    
    return result.rows[0] as unknown as User;
}