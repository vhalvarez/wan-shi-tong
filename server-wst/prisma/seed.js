import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // Crear permisos
    const viewPermission = await prisma.permissions.create({
        data: { name: 'view' }
    });

    const managePermission = await prisma.permissions.create({
        data: { name: 'manage' }
    });

    // Crear roles y asignar permisos
    const adminRole = await prisma.roles.create({
        data: {
            name: 'Administrador',
            permissions: {
                create: [
                    { permission: { connect: { id: viewPermission.id } } },
                    { permission: { connect: { id: managePermission.id } } }
                ]
            }
        }
    });

    const studentRole = await prisma.roles.create({
        data: {
            name: 'Estudiante',
            permissions: {
                create: [
                    { permission: { connect: { id: viewPermission.id } } }
                ]
            }
        }
    });

    // Crear usuarios y asignar roles
    const users = await Promise.all([
        prisma.users.create({
            data: {
                name: 'Student User',
                email: 'student@example.com',
                password: await bcrypt.hash('Student123!', 10), // Hashear la contraseña
                roles: {
                    create: [{ roleId: studentRole.id }]
                }
            }
        }),
        prisma.users.create({
            data: {
                name: 'Admin User',
                email: 'admin@example.com',
                password: await bcrypt.hash('Admin123!', 10), // Hashear la contraseña
                roles: {
                    create: [{ roleId: adminRole.id }]
                }
            }
        }),
        ...Array.from({ length: 10 }).map(async () =>
            prisma.users.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: await bcrypt.hash('password', 10),
                    roles: {
                        create: [{ roleId: studentRole.id }],
                    },
                },
            })
        ),
    ]);

    console.log('Roles y usuarios creados exitosamente.');

    // Crear libros con datos falsos
    const books = [];
    for (let i = 0; i < 10; i++) {
        books.push(
            prisma.books.create({
                data: {
                    titulo: faker.lorem.words(3),
                    autor: faker.person.fullName(),
                    isbn: faker.string.uuid(),
                    anio_publicacion: faker.date.past().getFullYear(),
                    genero: faker.lorem.word(),
                    cantidad_disponible: faker.number.int({ min: 1, max: 10 }),
                    cantidad_total: faker.number.int({ min: 5, max: 20 }),
                    portada: faker.image.urlPicsumPhotos(),
                },
            })
        );
    }

    await Promise.all(books);

    const allBooks = await prisma.books.findMany();
    const allUsers = await prisma.users.findMany();

    // Crear préstamos con datos falsos
    const loans = [];
    for (let i = 0; i < 5; i++) {
        loans.push(
            prisma.loans.create({
                data: {
                    fecha_prestamo: faker.date.past(),
                    estado: 'prestado',
                    userId: allUsers[faker.number.int({ min: 0, max: allUsers.length - 1 })].id,
                    bookId: allBooks[faker.number.int({ min: 0, max: allBooks.length - 1 })].id,
                },
            })
        );
    }

    await Promise.all(loans);

    // Crear reservas con datos falsos
    const reservations = [];
    for (let i = 0; i < 5; i++) {
        reservations.push(
            prisma.reservations.create({
                data: {
                    fecha_reserva: faker.date.past(),
                    estado: 'pendiente',
                    userId: allUsers[faker.number.int({ min: 0, max: allUsers.length - 1 })].id,
                    bookId: allBooks[faker.number.int({ min: 0, max: allBooks.length - 1 })].id,
                },
            })
        );
    }

    await Promise.all(reservations);

    // Crear multas con datos falsos
    const fines = [];
    for (let i = 0; i < 5; i++) {
        fines.push(
            prisma.fines.create({
                data: {
                    monto: faker.number.float({ min: 1, max: 100 }),
                    pagada: faker.datatype.boolean(),
                    fecha_multa: faker.date.past(),
                    userId: allUsers[faker.number.int({ min: 0, max: allUsers.length - 1 })].id,
                },
            })
        );
    }

    await Promise.all(fines);

    console.log('Datos de ejemplo creados');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
