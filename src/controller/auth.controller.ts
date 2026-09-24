import type {Request,Response} from 'express';
import { createUser, findByEmail } from '../repositories/user.repository';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

    const existingUser = await findByEmail(email);
    if(existingUser){
        res.status(400).json({message: 'El correo electrónico ya existe.'});
        return;
    }

    const saltRounds = 10;
    const hashedPasssword = await bcrypt.hash(password, saltRounds);
    
    const newUser = await createUser(nombre, email, hashedPasssword);

    const secret = process.env.JWT_SECRET || 'secret_key_default';
    const token = jwt.sign(
        {id: newUser.id, email: newUser.email},
        secret,
        {expiresIn: '2h'}   
    );
    

    res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        token,
        user: {
            id: newUser.id,
            email: newUser.email,
            nombre: newUser.nombre
        }
    });
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({ message: 'El correo y la contraseña son obligatorios'})
            return;
        }

        const user = await findByEmail(email);
        if(!user){
            res.status(401).json({ message: 'Credenciales inváidas.'});
            return;
        }

        const secret = process.env.JWT_SECRET || 'secretkeydefault';
        const token = jwt.sign(
            {id: user.id, email: user.email},
            secret,
            {expiresIn: '2h'}
        );

        res.status(200).json({
            message: 'Inicio de sesion existoso.',
            token,
            user:{
                id: user.id,
                email: user.email,
                name: user.nombre
            }
        });
    } catch (error) {
        console.error('Error en el login.', error);
        res.status(500).json({message: 'Error en el servidor interno.'});
    }
}