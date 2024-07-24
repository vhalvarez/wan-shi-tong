import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client.js";
import validatePassword from "../utils/validatePassword.js";
import { checkAuthStatus, getJwtToken } from "../utils/auth.js";
import { authenticateToken } from "../middleware/auth.js";

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
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       description: Datos del usuario a registrar
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
 *             example:
 *               name: John Doe
 *               email: johndoe@example.com
 *               cedula: 24992476
 *               password: Password123!
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Users'
 *                 message:
 *                   type: string
 *       400:
 *         description: La solicitud no es válida
 *       409:
 *         description: El usuario ya existe
 *       500:
 *         description: Error en el servidor
 */
router.post("/register", async (req, res) => {
    const { name, email, password, cedula } = req.body;

    if (!validatePassword(password)) {
        return res
            .status(400)
            .json({
                message:
                    "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.",
            });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
        return res.status(409).json({ message: "El usuario ya existe" });
    }

    const existingCedula = await prisma.users.findUnique({ where: { cedula } });

    if (existingCedula) {
        return res
            .status(409)
            .json({ message: "La cédula ya está registrada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword,
            cedula,
            roles: {
                create: {
                    role: {
                        connect: {
                            name: "Estudiante",
                        },
                    },
                },
            },
        },
        include: {
            roles: {
                include: {
                    role: true,
                },
            },
        },
    });

    const roles = user.roles.map((userRole) => userRole.role.name);
    const token = getJwtToken({ id: user.id });

    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            cedula: user.cedula,
            active: user.active,
            fecha_registro: user.fecha_registro,
            roles: roles,
        },
        token,
    });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión un usuario
 *     tags: [Auth]
 *     requestBody:
 *       description: Datos del usuario para iniciar sesión
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
 *             example:
 *               email: johndoe@example.com
 *               password: Password123!
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Users'
 *                 message:
 *                   type: string
 *       401:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       403:
 *         description: Usuario inactivo
 *       500:
 *         description: Error en el servidor
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            return res
                .status(401)
                .json({ message: "No se pudo verificar el usuario" });
        }

        if (!user.active) {
            return res.status(403).json({ message: "Usuario inactivo" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        const roles = user.roles.map((userRole) => userRole.role.name);
        const token = getJwtToken({ id: user.id });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                cedula: user.cedula,
                active: user.active,
                fecha_registro: user.fecha_registro,
                roles: roles,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
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
router.get("/check-status", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Asegurarse de que se obtiene el userId del token
        if (!userId) {
            return res
                .status(400)
                .json({ message: "Invalid token: userId is missing" });
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const authStatus = await checkAuthStatus(user);

        res.json(authStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al verificar el estado de autenticación",
        });
    }
});

export default router;
