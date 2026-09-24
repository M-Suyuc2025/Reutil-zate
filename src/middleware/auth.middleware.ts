import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Request, Response, NextFunction } from 'express';

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authorization = req.headers.authorization;

    const [type, token] = authorization?.split(' ')??[];

    if(type !== 'Bearer' || !token) {
        res.status(401).json({
            message: 'Token Requerido.'
        });

        return;
    }

    try {
        jwt.verify(token, env.jwtSecret);

        next();
    } catch (error) {
        res.status(401).json({
            message: 'Token Inválido o Vencido.'
        });
    }
}