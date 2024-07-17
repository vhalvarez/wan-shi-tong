import express from 'express';
import prisma from '../../prisma/client.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservatons
 *   description: Operaciones de reservas
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Obtiene una lista de reservas
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/', authenticateToken, async (req, res) => {
  const reservations = await prisma.reservations.findMany();
  res.json(reservations);
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos de la reserva a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date-time
 *               userId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *             example:
 *               fecha_reserva: '2023-07-15T15:22:00Z'
 *               userId: 1
 *               bookId: 1
 *     responses:
 *       201:
 *         description: Reserva creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authenticateToken, async (req, res) => {
  const { userId, bookId } = req.body;

  try {
      // Verificar si el usuario ya tiene un préstamo sin devolver
      const existingLoan = await prisma.loans.findFirst({
          where: {
              userId: userId,
              fecha_devolucion: null,
          },
      });

      if (existingLoan) {
          return res.status(400).json({ message: 'El usuario ya tiene un libro prestado y no puede reservar otro hasta que lo devuelva.' });
      }

      // Crear la nueva reserva
      const reservation = await prisma.reservations.create({
          data: {
              userId,
              bookId,
              fecha_reserva: new Date(),
              estado: 'pending',
          },
      });

      res.json(reservation);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la reserva' });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Obtiene una reserva por ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name
*         required: true
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reserva no encontrada
 */
router.get('/:id', authenticateToken, authorize('view'), async (req, res) => {
  const reservation = await prisma.reservations.findUnique({ where: { id: Number(req.params.id) } });
  res.json(reservation);
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Actualiza una reserva por ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva
 *     requestBody:
 *       description: Datos de la reserva a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 default: 'pendiente'
 *               userId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *             example:
 *               fecha_reserva: '2023-07-15T15:22:00Z'
 *               estado: 'confirmada'
 *               userId: 1
 *               bookId: 1
 *     responses:
 *       200:
 *         description: Reserva actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  const { fecha_reserva, estado, userId, bookId } = req.body;
  const reservation = await prisma.reservations.update({
    where: { id: Number(req.params.id) },
    data: {
      fecha_reserva,
      estado,
      userId,
      bookId,
    }
  });
  res.json(reservation);
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Elimina una reserva por ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva
 *     responses:
 *       204:
 *         description: Reserva eliminada
 *       404:
 *         description: Reserva no encontrada
 */
router.delete('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  await prisma.reservations.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
