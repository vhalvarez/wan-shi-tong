import express from 'express';
import prisma from '../../prisma/client.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categorias de los libros
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
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
router.get('/', async (req, res) => {
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
 *     tags: [Categories]
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
 *                   cantidad_disponible:
 *                     type: integer
 *                   cantidad_total:
 *                     type: integer
 *                   portada:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 */
router.get('/:categoryId/books', async (req, res) => {
    const { categoryId } = req.params;
    const { limit = 8, offset = 0 } = req.query;

    try {
        const books = await prisma.books.findMany({
            where: { categoryId: parseInt(categoryId) },
            take: parseInt(limit),
            skip: parseInt(offset),
            include: { category: true },
            orderBy: { id: 'asc' },
        });

        const response = books.map(book => ({
            ...book,
            category: book.category.name,
        }));

        res.json(response);
    } catch (error) {
        console.error('Error al obtener los libros por categoría:', error);
        res.status(500).json({ error: 'Error al obtener los libros por categoría' });
    }
});

export default router