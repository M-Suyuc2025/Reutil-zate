import type {Request,Response} from 'express';
import * as authService from '../service/auth.service';

export async function register(
    req: Request,
    res: Response,
): Promise<void> {
    const {
        nombre,
        email,
        password
    } = req.body

    if(!nombre || !email || !password || password.length){
        res.status(400).json({
            message: 'Nombre, Email Y Contraseña son Obligatorios.'
        });

        return;
    }

    
}