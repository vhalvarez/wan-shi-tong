import express from 'express';
import prisma from '../../prisma/client.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Fines
 *   description: Operaciones sobre multas
 */

/**
 * @swagger
 * /fines:
 *   get:
 *     summary: Obtiene una lista de multas
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de multas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fine'
 */
router.get('/', authenticateToken, authorize('view'), async (req, res) => {
  const fines = await prisma.fines.findMany();
  res.json(fines);
});

/**
 * @swagger
 * /fines:
 *   post:
 *     summary: Crea una nueva multa
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos de la multa a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monto:
 *                 type: number
 *                 format: float
 *               pagada:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *             example:
 *               monto: 50.0
 *               pagada: false
 *               userId: 1
 *     responses:
 *       201:
 *         description: Multa creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fine'
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authenticateToken, authorize('manage'), async (req, res) => {
  const { monto, pagada, userId } = req.body;
  const fine = await prisma.fines.create({
    data: {
      monto,
      pagada,
      userId,
    }
  });
  res.status(201).json(fine);
});

/**
 * @swagger
 * /fines/{id}:
 *   get:
 *     summary: Obtiene una multa por ID
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la multa
 *     responses:
 *       200:
 *         description: Multa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fine'
 *       404:
 *         description: Multa no encontrada
 */
router.get('/:id', authenticateToken, authorize('view'), async (req, res) => {
  const fine = await prisma.fines.findUnique({ where: { id: Number(req.params.id) } });
  res.json(fine);
});

/**
 * @swagger
 * /fines/{id}:
 *   put:
 *     summary: Actualiza una multa por ID
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la multa
 *     requestBody:
 *       description: Datos de la multa a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monto:
 *                 type: number
 *                 format: float
 *               pagada:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *             example:
 *               monto: 50.0
 *               pagada: true
 *               userId: 1
 *     responses:
 *       200:
 *         description: Multa actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fine'
 *       404:
 *         description: Multa no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  const { monto, pagada, userId } = req.body;
  const fine = await prisma.fines.update({
    where: { id: Number(req.params.id) },
    data: {
      monto,
      pagada,
      userId,
    }
  });
  res.json(fine);
});

/**
 * @swagger
 * /fines/{id}:
 *   delete:
 *     summary: Elimina una multa por ID
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la multa
 *     responses:
 *       204:
 *         description: Multa eliminada
 *       404:
 *         description: Multa no encontrada
 */
router.delete('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  await prisma.fines.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
