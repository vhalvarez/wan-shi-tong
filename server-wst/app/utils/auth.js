import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';

// Función para generar el token JWT
const getJwtToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
    return token;
};

// Función para verificar el estado de autenticación y devolver el usuario y el token
const checkAuthStatus = async (user) => {
    const roles = user.roles.map((userRole) => userRole.role.name);
    
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            cedula: user.cedula,
            fecha_registro: user.fecha_registro,
            roles: roles
        },
        token: getJwtToken({ id: user.id })
    };
};

export { getJwtToken, checkAuthStatus };
