import express from 'express';
import prisma from '../../prisma/client.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

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
router.get('/', authenticateToken, authorize('view'), async (req, res) => {
  const roles = await prisma.roles.findMany({ include: { permissions: true } });
  res.json(roles);
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
router.post('/', authenticateToken, authorize('manage'), async (req, res) => {
  const { name, permissions } = req.body;
  const role = await prisma.roles.create({
    data: {
      name,
      permissions: {
        connect: permissions.map(permission => ({ name: permission }))
      }
    },
    include: { permissions: true }
  });
  res.status(201).json(role);
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
router.get('/:id', authenticateToken, authorize('view'), async (req, res) => {
  const role = await prisma.roles.findUnique({ where: { id: Number(req.params.id) }, include: { permissions: true } });
  res.json(role);
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
router.put('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  const { name, permissions } = req.body;
  const role = await prisma.roles.update({
    where: { id: Number(req.params.id) },
    data: {
      name,
      permissions: {
        set: [],
        connect: permissions.map(permission => ({ name: permission }))
      }
    },
    include: { permissions: true }
  });
  res.json(role);
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
router.delete('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  await prisma.roles.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
