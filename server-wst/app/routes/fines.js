import express from "express";
import prisma from "../../prisma/client.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

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
router.get("/", authenticateToken, authorize("view"), async (req, res) => {
    const { limit = 8, offset = 0 } = req.query;

    try {
        let fines;

        if (req.user.isAdmin) {
            // Si el usuario es administrador, obtiene todas las multas con paginación
            fines = await prisma.fines.findMany({
                take: parseInt(limit),
                skip: parseInt(offset),
                include: { user: true },
                orderBy: {
                    id: "asc",
                },
            });
        } else {
            // Si el usuario no es administrador, obtiene solo sus multas con paginación
            fines = await prisma.fines.findMany({
                where: { userId: req.user.id },
                take: parseInt(limit),
                skip: parseInt(offset),
                include: { user: true },
                orderBy: {
                    id: "asc",
                },
            });
        }

        res.json(fines);
    } catch (error) {
        console.error("Error al obtener las multas:", error);
        res.status(500).json({ error: "Error al obtener las multas" });
    }
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
router.post("/", authenticateToken, authorize("manage"), async (req, res) => {
    const { monto, email } = req.body;

    try {
        // Buscar el usuario por su correo electrónico
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Crear la multa con pagada como false por defecto
        const fine = await prisma.fines.create({
            data: {
                monto,
                pagada: false,
                userId: user.id,
            },
        });

        res.status(201).json(fine);
    } catch (error) {
        console.error("Error al crear la multa:", error);
        res.status(500).json({ error: "Error al crear la multa" });
    }
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
router.delete(
    "/:id",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        try {
            await prisma.fines.delete({ where: { id: Number(req.params.id) } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar la multa" });
        }
    }
);

/**
 * @swagger
 * /fines/pay:
 *   put:
 *     summary: Pagar una multa
 *     description: Actualiza el estado de una multa a pagada.
 *     tags:
 *       - Fines
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fineId
 *             properties:
 *               fineId:
 *                 type: integer
 *                 description: ID de la multa a pagar
 *     responses:
 *       200:
 *         description: Multa actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 monto:
 *                   type: number
 *                 pagada:
 *                   type: boolean
 *                 fecha_multa:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *       404:
 *         description: Multa no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Multa no encontrada
 *       500:
 *         description: Error al actualizar la multa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar la multa
 */
router.put("/pay", authenticateToken, authorize("manage"), async (req, res) => {
    const { fineId } = req.body;

    try {
        // Buscar la multa por su ID
        const fine = await prisma.fines.findUnique({
            where: { id: parseInt(fineId) },
            include: { user: true },
        });

        if (!fine) {
            return res.status(404).json({ error: "Multa no encontrada" });
        }

        // Actualizar el estado de la multa a pagada
        const updatedFine = await prisma.fines.update({
            where: { id: fine.id },
            data: { pagada: true },
        });

        res.json(updatedFine);
    } catch (error) {
        console.error("Error al actualizar la multa:", error);
        res.status(500).json({ error: "Error al actualizar la multa" });
    }
});

export default router;
