import express from "express";
import prisma from "../../prisma/client.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Operaciones sobre préstamos
 */

/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Obtiene una lista de préstamos
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 */
router.get("/", authenticateToken, async (req, res) => {
    try {
        let loans;

        if (req.user.isAdmin) {
            // Si el usuario es administrador, obtiene todos los préstamos
            loans = await prisma.loans.findMany({
                include: {
                    book: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            cedula: true,
                            fecha_registro: true,
                        },
                    },
                },
            });
        } else {
            // Si el usuario no es administrador, obtiene solo sus préstamos
            loans = await prisma.loans.findMany({
                where: { userId: req.user.id },
                include: {
                    book: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            cedula: true,
                            fecha_registro: true,
                        },
                    },
                },
            });
        }

        res.json(loans);
    } catch (error) {
        console.error("Error al obtener los préstamos:", error);
        res.status(500).json({ message: "Error al obtener los préstamos" });
    }
});

/**
 * @swagger
 * /loans/by-cedula/{cedula}:
 *   get:
 *     summary: Obtiene una lista de préstamos por cédula
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cedula
 *         schema:
 *           type: string
 *         required: true
 *         description: Cédula del usuario
 *     responses:
 *       200:
 *         description: Lista de préstamos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 *       404:
 *         description: No se encontraron préstamos para la cédula proporcionada
 */
router.get("/by-cedula/:cedula", authenticateToken, async (req, res) => {
    const { cedula } = req.params;
    try {
        const user = await prisma.users.findUnique({
            where: { cedula },
            select: {
                id: true,
                name: true,
                email: true,
                cedula: true,
                fecha_registro: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        let loans;

        if (req.user.isAdmin || req.user.id === user.id) {
            // Si el usuario es administrador o el propietario de la cédula, obtiene los préstamos
            loans = await prisma.loans.findMany({
                where: { userId: user.id },
                include: {
                    book: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            cedula: true,
                            fecha_registro: true,
                        },
                    },
                },
            });
        } else {
            return res.status(403).json({
                message: "No tienes permiso para ver estos préstamos",
            });
        }

        res.json(loans);
    } catch (error) {
        console.error("Error al obtener los préstamos:", error);
        res.status(500).json({ message: "Error al obtener los préstamos" });
    }
});

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Crear un nuevo préstamo
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *               bookId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Préstamo creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: El usuario ya tiene un libro prestado
 */
router.post("/", authenticateToken, authorize("manage"), async (req, res) => {
    const { cedula, bookId } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { cedula },
            select: {
                id: true,
                name: true,
                email: true,
                cedula: true,
                fecha_registro: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar si el usuario ya tiene un préstamo sin devolver
        const existingLoan = await prisma.loans.findFirst({
            where: {
                userId: user.id,
                fecha_devolucion: null,
            },
        });

        if (existingLoan) {
            return res.status(400).json({
                message:
                    "El usuario ya tiene un libro prestado y no puede solicitar otro hasta que lo devuelva.",
            });
        }

        // Crear el nuevo préstamo
        const loan = await prisma.loans.create({
            data: {
                userId: user.id,
                bookId,
                fecha_prestamo: new Date(),
            },
        });

        res.json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el préstamo" });
    }
});

/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     summary: Obtiene un préstamo por ID
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del préstamo
 *     responses:
 *       200:
 *         description: Préstamo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       404:
 *         description: Préstamo no encontrado
 */
router.get("/:id", authenticateToken, authorize("view"), async (req, res) => {
    try {
        const loan = await prisma.loans.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        cedula: true,
                        fecha_registro: true,
                    },
                },
                book: true,
            },
        });

        if (!loan) {
            return res.status(404).json({ message: "Préstamo no encontrado" });
        }

        res.json(loan);
    } catch (error) {
        console.error("Error al obtener el préstamo:", error);
        res.status(500).json({ message: "Error al obtener el préstamo" });
    }
});

/**
 * @swagger
 * /loans/{id}:
 *   put:
 *     summary: Actualiza un préstamo por ID
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del préstamo
 *     requestBody:
 *       description: Datos del préstamo a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_prestamo:
 *                 type: string
 *                 format: date-time
 *               fecha_devolucion:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 default: 'prestado'
 *               userId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *             example:
 *               fecha_prestamo: '2023-07-15T15:22:00Z'
 *               fecha_devolucion: '2023-08-15T15:22:00Z'
 *               estado: 'devuelto'
 *               userId: 1
 *               bookId: 1
 *     responses:
 *       200:
 *         description: Préstamo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       404:
 *         description: Préstamo no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put("/:id", authenticateToken, authorize("manage"), async (req, res) => {
    const { fecha_devolucion, estado } = req.body;

    const formattedFechaDevolucion = fecha_devolucion ? new Date(fecha_devolucion).toISOString() : null;

    try {
        const loan = await prisma.loans.update({
            where: { id: Number(req.params.id) },
            data: {
                fecha_devolucion: formattedFechaDevolucion,
                estado,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        cedula: true,
                        fecha_registro: true,
                    },
                },
                book: true,
            },
        });

        res.json(loan);
    } catch (error) {
        console.error("Error al actualizar el préstamo:", error);
        res.status(500).json({ message: "Error al actualizar el préstamo" });
    }
});

/**
 * @swagger
 * /loans/{id}:
 *   delete:
 *     summary: Elimina un préstamo por ID
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del préstamo
 *     responses:
 *       204:
 *         description: Préstamo eliminado
 *       404:
 *         description: Préstamo no encontrado
 */
router.delete(
    "/:id",
    authenticateToken,
    authorize("manage"),
    async (req, res) => {
        try {
            const loan = await prisma.loans.delete({ where: { id: Number(req.params.id) } });
            if (!loan) {
                return res.status(404).json({ message: "Préstamo no encontrado" });
            }
            res.status(204).send();
        } catch (error) {
            console.error("Error al eliminar el préstamo:", error);
            res.status(500).json({ message: "Error al eliminar el préstamo" });
        }
    }
);

export default router;
