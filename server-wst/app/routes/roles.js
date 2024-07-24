import express from "express";
import prisma from "../../prisma/client.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Operaciones sobre roles
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene una lista de roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get("/", authenticateToken, authorize("manage"), async (req, res) => {
    try {
        const roles = await prisma.roles.findMany({
            include: { permissions: true },
        });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener roles" });
    }
});

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del rol a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: librarian
 *               permissions: ["view", "manage"]
 *     responses:
 *       201:
 *         description: Rol creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */
router.post("/", authenticateToken, authorize("manage"), async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const role = await prisma.roles.create({
            data: {
                name,
                permissions: {
                    connect: permissions.map((permission) => ({
                        name: permission,
                    })),
                },
            },
            include: { permissions: true },
        });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el rol" });
    }
});

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Obtiene un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 */
router.get("/:id", authenticateToken, authorize("manage"), async (req, res) => {
    try {
        const role = await prisma.roles.findUnique({
            where: { id: Number(req.params.id) },
            include: { permissions: true },
        });
        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el rol" });
    }
});

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Actualiza un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     requestBody:
 *       description: Datos del rol a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: librarian
 *               permissions: ["view", "manage"]
 *     responses:
 *       200:
 *         description: Rol actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put("/:id", authenticateToken, authorize("manage"), async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const role = await prisma.roles.update({
            where: { id: Number(req.params.id) },
            data: {
                name,
                permissions: {
                    set: [],
                    connect: permissions.map((permission) => ({
                        name: permission,
                    })),
                },
            },
            include: { permissions: true },
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el rol" });
    }
});

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Elimina un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       204:
 *         description: Rol eliminado
 *       404:
 *         description: Rol no encontrado
 */
router.delete(
    "/:id",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        try {
            await prisma.roles.delete({ where: { id: Number(req.params.id) } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el rol" });
        }
    }
);

/**
 * @swagger
 * /roles/assign:
 *   post:
 *     summary: Asigna un rol a un usuario por cédula
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos de asignación de rol
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *               roleId:
 *                 type: integer
 *             example:
 *               cedula: "12345678"
 *               roleId: 2
 *     responses:
 *       200:
 *         description: Rol asignado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersRoles'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.post(
    "/assign",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        const { cedula, roleId } = req.body;
        try {
            const user = await prisma.users.findUnique({ where: { cedula } });
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Usuario no encontrado" });
            }

            const userRole = await prisma.usersRoles.create({
                data: {
                    userId: user.id,
                    roleId,
                },
                include: {
                    user: true,
                    role: true,
                },
            });

            res.json(userRole);
        } catch (error) {
            res.status(500).json({ error: "Error al asignar el rol" });
        }
    }
);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Obtiene una lista de permisos
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.get(
    "/permissions",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        try {
            const permissions = await prisma.permissions.findMany();
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener permisos" });
        }
    }
);

/**
 * @swagger
 * /permissions/assign:
 *   post:
 *     summary: Asigna un permiso a un rol
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos de asignación de permiso
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *               permissionId:
 *                 type: integer
 *             example:
 *               roleId: 1
 *               permissionId: 2
 *     responses:
 *       200:
 *         description: Permiso asignado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolesPermissions'
 *       404:
 *         description: Rol o permiso no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.post(
    "/permissions/assign",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        const { roleId, permissionId } = req.body;
        try {
            const role = await prisma.roles.findUnique({
                where: { id: roleId },
            });
            const permission = await prisma.permissions.findUnique({
                where: { id: permissionId },
            });

            if (!role || !permission) {
                return res
                    .status(404)
                    .json({ message: "Rol o permiso no encontrado" });
            }

            const rolePermission = await prisma.rolesPermissions.create({
                data: {
                    roleId,
                    permissionId,
                },
                include: {
                    role: true,
                    permission: true,
                },
            });

            res.json(rolePermission);
        } catch (error) {
            res.status(500).json({ error: "Error al asignar el permiso" });
        }
    }
);

export default router;
