import express from 'express';
import prisma from '../../prisma/client.js';
const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
});

/**
 * @swagger
 * /categories/{categoryId}/books:
 *   get:
 *     summary: Retrieve a list of books by category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   autor:
 *                     type: string
 *                   isbn:
 *                     type: string
 *                   anio_publicacion:
 *                     type: integer
 *                   genero:
 *                     type: string
 *                   cantidad_disponible:
 *                     type: integer
 *                   cantidad_total:
 *                     type: integer
 *                   portada:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 */
router.get('/categories/:categoryId/books', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const books = await prisma.books.findMany({
            where: { categoryId: parseInt(categoryId) },
            include: { category: true },
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los libros por categoría' });
    }
});

/**
 * @swagger
 * /categories/{categoryId}/books/search:
 *   get:
 *     summary: Search books by title within a category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The book title
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   autor:
 *                     type: string
 *                   isbn:
 *                     type: string
 *                   anio_publicacion:
 *                     type: integer
 *                   genero:
 *                     type: string
 *                   cantidad_disponible:
 *                     type: integer
 *                   cantidad_total:
 *                     type: integer
 *                   portada:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 */
router.get('/categories/:categoryId/books/search', async (req, res) => {
    const { categoryId } = req.params;
    const { title } = req.query;
    try {
        const books = await prisma.books.findMany({
            where: {
                categoryId: parseInt(categoryId),
                titulo: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
            include: { category: true },
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar los libros por categoría' });
    }
});


export default router