import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../prisma/client.js';
import validatePassword from '../utils/validatePassword.js';
import {  checkAuthStatus } from '../utils/auth.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   descripción: Autenticación y registro
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: {
                    create: {
                        role: {
                            connect: {
                                name: 'Estudiante',
                            }
                        }
                    }
                }
            },
        });

        const authStatus = await checkAuthStatus(user);

        res.json(authStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const authStatus = await checkAuthStatus(user);

        res.json(authStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

/**
 * @swagger
 * /auth/check-status:
 *   get:
 *     summary: Verificar el estado de autenticación
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de autenticación verificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 */
router.get('/check-status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Asegurarse de que se obtiene el userId del token
        if (!userId) {
            return res.status(400).json({ message: 'Invalid token: userId is missing' });
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const authStatus = await checkAuthStatus(user);

        res.json(authStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar el estado de autenticación' });
    }
});

export default router;
