const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'Biblioteca API - OpenAPI 3.0',
        description: 'API para gestionar una biblioteca universitaria',
        termsOfService: 'http://example.com/terms/',
        contact: {
            email: 'api@example.com',
        },
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
        version: '1.0.0',
    },
    externalDocs: {
        description: 'Encuentra más información',
        url: 'http://example.com',
    },
    servers: [
        {
            url: 'http://localhost:4000/api',
            description: 'Servidor de desarrollo',
        },
    ],
    components: {
        schemas: {
            Book: {
                type: 'object',
                required: ['titulo', 'autor', 'isbn', 'cantidad_disponible', 'cantidad_total'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID del libro',
                    },
                    titulo: {
                        type: 'string',
                        description: 'Título del libro',
                    },
                    autor: {
                        type: 'string',
                        description: 'Autor del libro',
                    },
                    isbn: {
                        type: 'string',
                        description: 'ISBN del libro',
                    },
                    anio_publicacion: {
                        type: 'integer',
                        description: 'Año de publicación del libro',
                    },
                    genero: {
                        type: 'string',
                        description: 'Género del libro',
                    },
                    cantidad_disponible: {
                        type: 'integer',
                        description: 'Cantidad disponible del libro',
                    },
                    cantidad_total: {
                        type: 'integer',
                        description: 'Cantidad total del libro',
                    },
                    portada: {
                        type: 'string',
                        description: 'URL de la portada del libro',
                    },
                },
                example: {
                    id: 1,
                    titulo: 'El Principito',
                    autor: 'Antoine de Saint-Exupéry',
                    isbn: '978-3-16-148410-0',
                    anio_publicacion: 1943,
                    genero: 'Ficción',
                    cantidad_disponible: 10,
                    cantidad_total: 20,
                    portada: 'https://example.com/portada.jpg',
                },
            },
            User: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID del usuario',
                    },
                    name: {
                        type: 'string',
                        description: 'Nombre del usuario',
                    },
                    email: {
                        type: 'string',
                        description: 'Email del usuario',
                    },
                    password: {
                        type: 'string',
                        description: 'Contraseña del usuario',
                    },
                    fecha_registro: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Fecha de registro del usuario',
                    },
                    roles: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Roles del usuario',
                    },
                },
                example: {
                    id: 1,
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'Password123!',
                    fecha_registro: '2023-07-15T15:22:00Z',
                    roles: ['student'],
                },
            },
            Role: {
                type: 'object',
                required: ['name'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID del rol',
                    },
                    name: {
                        type: 'string',
                        description: 'Nombre del rol',
                    },
                    permissions: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Permisos del rol',
                    },
                },
                example: {
                    id: 1,
                    name: 'student',
                    permissions: ['view'],
                },
            },
            Loan: {
                type: 'object',
                required: ['fecha_prestamo', 'userId', 'bookId'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID del préstamo',
                    },
                    fecha_prestamo: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Fecha del préstamo',
                    },
                    fecha_devolucion: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Fecha de devolución del préstamo',
                    },
                    estado: {
                        type: 'string',
                        description: 'Estado del préstamo',
                        default: 'prestado',
                    },
                    userId: {
                        type: 'integer',
                        description: 'ID del usuario que realiza el préstamo',
                    },
                    bookId: {
                        type: 'integer',
                        description: 'ID del libro prestado',
                    },
                },
                example: {
                    id: 1,
                    fecha_prestamo: '2023-07-15T15:22:00Z',
                    fecha_devolucion: null,
                    estado: 'prestado',
                    userId: 1,
                    bookId: 1,
                },
            },
            Reservation: {
                type: 'object',
                required: ['fecha_reserva', 'userId', 'bookId'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID de la reserva',
                    },
                    fecha_reserva: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Fecha de la reserva',
                    },
                    estado: {
                        type: 'string',
                        description: 'Estado de la reserva',
                        default: 'pendiente',
                    },
                    userId: {
                        type: 'integer',
                        description: 'ID del usuario que realiza la reserva',
                    },
                    bookId: {
                        type: 'integer',
                        description: 'ID del libro reservado',
                    },
                },
                example: {
                    id: 1,
                    fecha_reserva: '2023-07-15T15:22:00Z',
                    estado: 'pendiente',
                    userId: 1,
                    bookId: 1,
                },
            },
            Fine: {
                type: 'object',
                required: ['monto', 'userId'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID de la multa',
                    },
                    monto: {
                        type: 'number',
                        format: 'float',
                        description: 'Monto de la multa',
                    },
                    pagada: {
                        type: 'boolean',
                        description: 'Estado de pago de la multa',
                        default: false,
                    },
                    fecha_multa: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Fecha de la multa',
                    },
                    userId: {
                        type: 'integer',
                        description: 'ID del usuario que recibe la multa',
                    },
                },
                example: {
                    id: 1,
                    monto: 50.0,
                    pagada: false,
                    fecha_multa: '2023-07-15T15:22:00Z',
                    userId: 1,
                },
            },
        },
    },
};

export default swaggerDefinition