import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET_key, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Asegurarse de que user.id esté presente
    if (!user.id) {
      return res.status(400).json({ message: 'Invalid token: userId is missing' });
    }

    req.user = user;
    next();
  });
};

const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id: req.user.userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      const userRoles = user.roles.map((role) => role.role.name);
      if (!roles.some((role) => userRoles.includes(role))) {
        return res.sendStatus(403);
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al verificar permisos' });
    }
  };
};

export { authenticateToken, authorize };
