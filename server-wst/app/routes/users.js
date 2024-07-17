import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../prisma/client.js';
import validatePassword from '../utils/validatePassword.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

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
 *     summary: Obtener todos los usuarios
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
router.get('/', authenticateToken, authorize('manage'), async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
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
router.get('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(req.params.id) },
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
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
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
router.put('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  const { name, email, password, roles } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updatedData = {
      name: name || user.name,
      email: email || user.email
    };

    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.' });
      }
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (roles && roles.length > 0) {
      const userRoles = await prisma.roles.findMany({
        where: {
          name: {
            in: roles
          }
        }
      });
      await prisma.usersRoles.deleteMany({
        where: {
          userId: user.id
        }
      });
      for (const role of userRoles) {
        await prisma.usersRoles.create({
          data: {
            userId: user.id,
            roleId: role.id
          }
        });
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: parseInt(req.params.id) },
      data: updatedData
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Desactivar un usuario por ID
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
router.delete('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  try {
    const user = await prisma.users.update({
      where: { id: parseInt(req.params.id) },
      data: { active: false }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario desactivado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al desactivar el usuario' });
  }
});

export default router;
