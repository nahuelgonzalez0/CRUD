import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../routes/config'

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;  // obtener el token desde la cookie
    if (!token) return res.status(403).send('Acceso no autorizado') , res.redirect('tasks/acceso-denegado');  // si no hay token, se bloquea el acceso
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY) as JwtPayload;
        console.log('Token decodificado:', data);  // Aquí debes ver la propiedad `id`
        res.locals.user = data;  // Almacena la información del token en res.locals.user
        next();  // continuar a la siguiente funcion o ruta
    } catch (error) {
        res.status(401).send('Token inválido o expirado');  // si el token es invalido o expiro
    }
}
