import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import prisma from '../prisma/client.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import bookRoutes from './routes/books.js';
import loanRoutes from './routes/loans.js';
import reservationRoutes from './routes/reservations.js';
import fineRoutes from './routes/fines.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js'
import { authenticateToken, authorize } from './middleware/auth.js';
import swaggerjsdoc from 'swagger-jsdoc'
import swaggerui from 'swagger-ui-express'
import swaggerDefinition from './config/swagger.js'


const app = express();
const PORT = process.env.PORT || 4000;
const URL = process.env.URL || 'http://localhost';

// Middleware
app.use(cors());
app.use(express.json());


// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); 
app.use('/api/categories', categoryRoutes); 

// Middleware de autenticación para rutas protegidas
app.use('/api/users', authenticateToken, authorize('view', 'manage'), userRoutes);
app.use('/api/roles', authenticateToken, authorize('manage'), roleRoutes);
app.use('/api/loans', authenticateToken, loanRoutes);
app.use('/api/reservations', authenticateToken, reservationRoutes);
app.use('/api/fines', authenticateToken, fineRoutes);

// Configuración de Swagger
const options = {
    swaggerDefinition,
    apis: ['./app/routes/*.js'],
};

const spacs = swaggerjsdoc(options)
app.use("/api", swaggerui.serve, swaggerui.setup(spacs))


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${URL}:${PORT} 🚀`);
});

export default app;
