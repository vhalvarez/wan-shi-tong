import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;

        // Check if the user is an administrator
        try {
            const userRoles = await prisma.usersRoles.findMany({
                where: { userId: user.id },
                include: {
                    role: true,
                },
            });

            req.user.isAdmin = userRoles.some(
                (userRole) => userRole.role.name === "Administrador"
            );
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Error al verificar roles del usuario" });
        }

        next();
    });
};

const authorize = (requiredPermission) => {
    return async (req, res, next) => {
        const userId = req.user.id;

        try {
            const userRoles = await prisma.usersRoles.findMany({
                where: { userId },
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            });

            const hasPermission = userRoles.some((userRole) =>
                userRole.role.permissions.some(
                    (rolePermission) =>
                        rolePermission.permission.name === requiredPermission
                )
            );

            if (!hasPermission) {
                return res
                    .status(403)
                    .json({ error: "No tienes los permisos necesarios" });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: "Error al verificar permisos" });
        }
    };
};

export { authenticateToken, authorize };
