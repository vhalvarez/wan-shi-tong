import express from "express";
import prisma from "../../prisma/client.js";
import { authenticateToken, authorize } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuración de multer para guardar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "./uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Función para generar un ISBN aleatorio
function generateISBN() {
    const part1 = "978";
    const part2 = "3";
    const part3 = Math.floor(Math.random() * 900 + 100).toString();
    const part4 = Math.floor(Math.random() * 9000 + 1000).toString();
    const part5 = Math.floor(Math.random() * 10).toString();

    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Operaciones sobre libros
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Obtiene una lista de libros
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
// Ruta para obtener todos los libros (accesible para todos)
router.get("/", async (req, res) => {
    const { limit = 8, offset = 0 } = req.query;

    try {
        const books = await prisma.books.findMany({
            take: parseInt(limit),
            skip: parseInt(offset),
            include: {
                category: true,
            },
            orderBy: {
                id: "asc",
            },
        });

        const response = books.map((book) => ({
            ...book,
            category: book.category.name,
            portada: book.portada
                ? `${req.protocol}://${req.get("host")}${book.portada}`
                : null,
        }));

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los libros" });
    }
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Crea un nuevo libro
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del libro a crear
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               anio_publicacion:
 *                 type: integer
 *               cantidad_disponible:
 *                 type: integer
 *               cantidad_total:
 *                 type: integer
 *               portada:
 *                 type: string
 *                 format: binary
 *               categoryId:
 *                 type: integer
 *             example:
 *               titulo: El Principito
 *               autor: Antoine de Saint-Exupéry
 *               anio_publicacion: 1943
 *               cantidad_disponible: 10
 *               cantidad_total: 20
 *               categoryId: 1
 *     responses:
 *       201:
 *         description: Libro creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */
// Ruta para crear un nuevo libro (solo para administradores)
router.post(
    "/",
    authenticateToken,
    authorize("manage"),
    upload.single("portada"),
    async (req, res) => {
        const {
            titulo,
            autor,
            anio_publicacion,
            cantidad_total, // No se necesita cantidad_disponible en el cuerpo de la solicitud
            categoryId,
            descripcion,
        } = req.body;

        if (!req.file) {
            return res
                .status(400)
                .json({ error: "La portada es obligatoria." });
        }

        const portada = req.file ? `/uploads/${req.file.filename}` : null;
        const isbn = generateISBN();

        try {
            const book = await prisma.books.create({
                data: {
                    titulo,
                    autor,
                    isbn,
                    anio_publicacion: parseInt(anio_publicacion),
                    cantidad_disponible: parseInt(cantidad_total), // Usar cantidad_total para cantidad_disponible
                    cantidad_total: parseInt(cantidad_total),
                    portada,
                    categoryId: parseInt(categoryId),
                    descripcion,
                },
                include: {
                    category: true,
                },
            });
            res.status(201).json(book);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error al crear el libro" });
        }
    }
);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Obtiene un libro por ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del libro
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Libro no encontrado
 */
// Ruta para obtener un libro por ID (accesible para todos)
router.get("/:id", async (req, res) => {
    try {
        const book = await prisma.books.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                category: true,
            },
        });

        if (!book) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        const response = {
            ...book,
            category: book.category.name,
            portada: book.portada
                ? `${req.protocol}://${req.get("host")}${book.portada.replace(
                      /\\/g,
                      "/"
                  )}`
                : null,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el libro" });
    }
});
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Actualiza un libro por ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del libro
 *     requestBody:
 *       description: Datos del libro a actualizar
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               anio_publicacion:
 *                 type: integer
 *               cantidad_disponible:
 *                 type: integer
 *               cantidad_total:
 *                 type: integer
 *               portada:
 *                 type: string
 *                 format: binary
 *               categoryId:
 *                 type: integer
 *             example:
 *               titulo: El Principito
 *               autor: Antoine de Saint-Exupéry
 *               anio_publicacion: 1943
 *               cantidad_disponible: 10
 *               cantidad_total: 20
 *               categoryId: 1
 *     responses:
 *       200:
 *         description: Libro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Libro no encontrado
 *       500:
 *         description: Error en el servidor
 */
// Ruta para actualizar un libro por ID (solo para administradores)
router.put(
    "/:id",
    authenticateToken,
    authorize("manage"),
    upload.single("portada"),
    async (req, res) => {
        const {
            titulo,
            autor,
            anio_publicacion,
            cantidad_disponible,
            cantidad_total,
            categoryId,
            descripcion,
        } = req.body;

        let currentBook;
        try {
            currentBook = await prisma.books.findUnique({
                where: { id: Number(req.params.id) },
            });
            if (!currentBook) {
                return res.status(404).json({ error: "Libro no encontrado" });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Error al obtener el libro actual" });
        }

        const updatedData = {
            titulo,
            autor,
            anio_publicacion: anio_publicacion
                ? parseInt(anio_publicacion)
                : currentBook.anio_publicacion,
            cantidad_disponible: cantidad_disponible
                ? parseInt(cantidad_disponible)
                : currentBook.cantidad_disponible,
            cantidad_total: cantidad_total
                ? parseInt(cantidad_total)
                : currentBook.cantidad_total,
            categoryId: categoryId
                ? parseInt(categoryId)
                : currentBook.categoryId,
            descripcion: descripcion || currentBook.descripcion,
        };

        if (req.file) {
            const oldImagePath = path.join(
                __dirname,
                "../..",
                currentBook.portada
            );
            updatedData.portada = `/uploads/${req.file.filename}`;

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        try {
            const book = await prisma.books.update({
                where: { id: Number(req.params.id) },
                data: updatedData,
                include: {
                    category: true,
                },
            });
            res.json(book);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el libro" });
        }
    }
);

export default router