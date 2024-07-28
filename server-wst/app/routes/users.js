import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client.js";
import validatePassword from "../utils/validatePassword.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operaciones relacionadas con usuarios
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios (solo administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", authenticateToken, authorize("manage"), async (req, res) => {
    const { limit = 8, offset = 0 } = req.query;

    try {
        if (!req.user.isAdmin) {
            return res
                .status(403)
                .json({ error: "No tienes los permisos necesarios" });
        }

        const users = await prisma.users.findMany({
            take: parseInt(limit),
            skip: parseInt(offset),
            include: {
                roles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
        });

        const response = users.map((user) => ({
            ...user,
            roles: user.roles.length > 0 ? user.roles[0].role.name : null,
        }));

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (administradores o el propio usuario)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/:id", authenticateToken, authorize("view"), async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
                loans: {
                    include: {
                        book: true,
                    },
                },
                fines: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (!req.user.isAdmin && user.id !== req.user.id) {
            return res.status(403).json({
                error: "No puedes acceder a la información de otro usuario",
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID (administradores o el propio usuario)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
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
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put("/:id", authenticateToken, authorize("view"), async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (!req.user.isAdmin && user.id !== req.user.id) {
            return res.status(403).json({
                error: "No puedes editar la información de otro usuario",
            });
        }

        const updatedData = {
            name: name || user.name,
            email: email || user.email,
        };

        if (password) {
            if (!validatePassword(password)) {
                return res.status(400).json({
                    message:
                        "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.",
                });
            }
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.users.update({
            where: { id: parseInt(req.params.id) },
            data: updatedData,
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Desactivar un usuario por ID (solo administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario desactivado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete(
    "/:id",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        try {
            if (!req.user.isAdmin) {
                return res
                    .status(403)
                    .json({ error: "No tienes los permisos necesarios" });
            }

            const user = await prisma.users.update({
                where: { id: parseInt(req.params.id) },
                data: { active: false },
            });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Usuario no encontrado" });
            }

            res.json({ message: "Usuario desactivado con éxito" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al desactivar el usuario" });
        }
    }
);

/**
 * @swagger
 * /users/reactivate/{id}:
 *   put:
 *     summary: Reactivar un usuario por ID (solo administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario reactivado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put(
    "/reactivate/:id",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        try {
            if (!req.user.isAdmin) {
                return res
                    .status(403)
                    .json({ error: "No tienes los permisos necesarios" });
            }

            const user = await prisma.users.update({
                where: { id: parseInt(req.params.id) },
                data: { active: true },
            });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Usuario no encontrado" });
            }

            res.json({ message: "Usuario reactivado con éxito" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al reactivar el usuario" });
        }
    }
);

export default router;
