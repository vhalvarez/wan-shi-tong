const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Library API',
        version: '1.0.0',
        description: 'API for managing a library system',
    },
    servers: [
        {
            url: 'http://localhost:4000/api',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Users: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    fecha_registro: { type: 'string', format: 'date-time' },
                    active: { type: 'boolean' },
                    roles: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/UsersRoles' },
                    },
                    loans: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Loans' },
                    },
                    fines: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Fines' },
                    },
                },
            },
            Roles: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    users: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/UsersRoles' },
                    },
                    permissions: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/RolesPermissions' },
                    },
                },
            },
            Permissions: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    roles: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/RolesPermissions' },
                    },
                },
            },
            UsersRoles: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    userId: { type: 'integer' },
                    roleId: { type: 'integer' },
                    user: { $ref: '#/components/schemas/Users' },
                    role: { $ref: '#/components/schemas/Roles' },
                },
            },
            RolesPermissions: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    roleId: { type: 'integer' },
                    permissionId: { type: 'integer' },
                    role: { $ref: '#/components/schemas/Roles' },
                    permission: { $ref: '#/components/schemas/Permissions' },
                },
            },
            Categories: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    books: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Books' },
                    },
                },
            },
            Books: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    titulo: { type: 'string' },
                    autor: { type: 'string' },
                    isbn: { type: 'string' },
                    anio_publicacion: { type: 'integer' },
                    cantidad_disponible: { type: 'integer' },
                    cantidad_total: { type: 'integer' },
                    portada: { type: 'string' },
                    categoryId: { type: 'integer' },
                    category: { $ref: '#/components/schemas/Categories' },
                    loans: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Loans' },
                    },
                },
            },
            Loans: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    fecha_prestamo: { type: 'string', format: 'date-time' },
                    fecha_devolucion: { type: 'string', format: 'date-time' },
                    estado: { type: 'string' },
                    userId: { type: 'integer' },
                    bookId: { type: 'integer' },
                    user: { $ref: '#/components/schemas/Users' },
                    book: { $ref: '#/components/schemas/Books' },
                },
            },
            Fines: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    monto: { type: 'number' },
                    pagada: { type: 'boolean' },
                    fecha_multa: { type: 'string', format: 'date-time' },
                    userId: { type: 'integer' },
                    user: { $ref: '#/components/schemas/Users' },
                },
            },
        },
    },
};

export default swaggerDefinition