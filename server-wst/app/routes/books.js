import express from 'express';
import prisma from '../../prisma/client.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

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
router.get('/', async (req, res) => {
  try {
    const books = await prisma.books.findMany({
      include: {
        category: true,
      },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los libros' });
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               anio_publicacion:
 *                 type: integer
 *               genero:
 *                 type: string
 *               cantidad_disponible:
 *                 type: integer
 *               cantidad_total:
 *                 type: integer
 *               portada:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *             example:
 *               titulo: El Principito
 *               autor: Antoine de Saint-Exupéry
 *               isbn: 978-3-16-148410-0
 *               anio_publicacion: 1943
 *               genero: Ficción
 *               cantidad_disponible: 10
 *               cantidad_total: 20
 *               portada: https://example.com/portada.jpg
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
// Ruta para crear un nuevo libro (solo para usuarios con el permiso "manage")
router.post('/', authenticateToken, authorize('manage'), async (req, res) => {
  const { titulo, autor, isbn, anio_publicacion, genero, cantidad_disponible, cantidad_total, portada, categoryId } = req.body;
  try {
    const book = await prisma.books.create({
      data: {
        titulo,
        autor,
        isbn,
        anio_publicacion,
        genero,
        cantidad_disponible,
        cantidad_total,
        portada,
        categoryId,
      }
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el libro' });
  }
});

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
router.get('/:id', async (req, res) => {
  try {
    const book = await prisma.books.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
      },
    });
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el libro' });
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               anio_publicacion:
 *                 type: integer
 *               genero:
 *                 type: string
 *               cantidad_disponible:
 *                 type: integer
 *               cantidad_total:
 *                 type: integer
 *               portada:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *             example:
 *               titulo: El Principito
 *               autor: Antoine de Saint-Exupéry
 *               isbn: 978-3-16-148410-0
 *               anio_publicacion: 1943
 *               genero: Ficción
 *               cantidad_disponible: 10
 *               cantidad_total: 20
 *               portada: https://example.com/portada.jpg
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
// Ruta para actualizar un libro por ID (solo para usuarios con el permiso "manage")
router.put('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  const { titulo, autor, isbn, anio_publicacion, genero, cantidad_disponible, cantidad_total, portada, categoryId } = req.body;
  try {
    const book = await prisma.books.update({
      where: { id: Number(req.params.id) },
      data: {
        titulo,
        autor,
        isbn,
        anio_publicacion,
        genero,
        cantidad_disponible,
        cantidad_total,
        portada,
        categoryId,
      }
    });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Elimina un libro por ID
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
 *     responses:
 *       204:
 *         description: Libro eliminado
 *       404:
 *         description: Libro no encontrado
 */
// Ruta para eliminar un libro por ID (solo para usuarios con el permiso "manage")
router.delete('/:id', authenticateToken, authorize('manage'), async (req, res) => {
  try {
    await prisma.books.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el libro' });
  }
});

export default router;
