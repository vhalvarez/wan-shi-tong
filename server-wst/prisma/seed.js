import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function generateUniqueCedula(existingCedulas) {
    let cedula;
    do {
        cedula = faker.number.int({ min: 1000000, max: 99999999 }).toString();
    } while (existingCedulas.has(cedula));
    existingCedulas.add(cedula);
    return cedula;
}

async function main() {
    // Crear permisos
    const viewPermission = await prisma.permissions.create({
        data: { name: "view" },
    });

    const managePermission = await prisma.permissions.create({
        data: { name: "manage" },
    });

    // Crear roles y asignar permisos
    const adminRole = await prisma.roles.create({
        data: {
            name: "Administrador",
            permissions: {
                create: [
                    { permission: { connect: { id: viewPermission.id } } },
                    { permission: { connect: { id: managePermission.id } } },
                ],
            },
        },
    });

    const studentRole = await prisma.roles.create({
        data: {
            name: "Estudiante",
            permissions: {
                create: [
                    { permission: { connect: { id: viewPermission.id } } },
                ],
            },
        },
    });

    // Crear usuarios y asignar roles
    const existingCedulas = new Set();
    const users = await Promise.all([
        prisma.users.create({
            data: {
                name: "Student User",
                email: "student@example.com",
                password: await bcrypt.hash("Student123!", 10), // Hashear la contraseña
                cedula: generateUniqueCedula(existingCedulas),
                active: true,
                roles: {
                    create: [{ roleId: studentRole.id }],
                },
            },
        }),
        prisma.users.create({
            data: {
                name: "Admin User",
                email: "admin@example.com",
                password: await bcrypt.hash("Admin123!", 10), // Hashear la contraseña
                cedula: generateUniqueCedula(existingCedulas),
                active: true,
                roles: {
                    create: [{ roleId: adminRole.id }],
                },
            },
        }),
        ...Array.from({ length: 50 }).map(async () => {
            const isActive = faker.datatype.boolean(); // Generar true o false aleatoriamente
            return prisma.users.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: await bcrypt.hash("password", 10),
                    cedula: generateUniqueCedula(existingCedulas),
                    active: isActive,
                    roles: {
                        create: [{ roleId: studentRole.id }],
                    },
                },
            });
        }),
    ]);

    console.log("Roles y usuarios creados exitosamente.");

    // Crear 20 categorías académicas
    const categoryNames = [
        "Psicología",
        "Arte",
        "Ciencia",
        "Historia",
        "Literatura",
        "Matemáticas",
        "Física",
        "Química",
        "Biología",
        "Ingeniería",
        "Medicina",
        "Derecho",
        "Economía",
        "Filosofía",
        "Sociología",
        "Educación",
        "Antropología",
        "Geografía",
        "Lingüística",
        "Política",
    ];

    const categories = await Promise.all(
        categoryNames.map((name) =>
            prisma.categories.create({ data: { name } })
        )
    );

    console.log("Categorías creadas exitosamente.");

    // Crear 500 libros con datos falsos y asignar categorías aleatorias
    const books = [];
    for (let i = 0; i < 500; i++) {
        const cantidad_total = faker.number.int({ min: 5, max: 20 });
        const cantidad_disponible = faker.number.int({
            min: 1,
            max: cantidad_total,
        });
        const randomWidth = faker.number.int({ min: 600, max: 1200 });
        const randomHeight = faker.number.int({ min: 600, max: 1200 });

        books.push(
            prisma.books.create({
                data: {
                    titulo: faker.lorem.words(3),
                    autor: faker.person.fullName(),
                    isbn: faker.string.uuid(),
                    anio_publicacion: faker.date.past().getFullYear(),
                    cantidad_disponible,
                    cantidad_total,
                    portada: `https://picsum.photos/${randomWidth}/${randomHeight}`,
                    descripcion: faker.lorem.paragraph(),
                    categoryId:
                        categories[
                            faker.number.int({
                                min: 0,
                                max: categories.length - 1,
                            })
                        ].id,
                },
            })
        );
    }

    await Promise.all(books);

    const allBooks = await prisma.books.findMany();
    const allUsers = await prisma.users.findMany();

    // Crear préstamos con datos falsos
    const loans = [];
    for (let i = 0; i < 50; i++) {
        loans.push(
            prisma.loans.create({
                data: {
                    fecha_prestamo: faker.date.past(),
                    estado: "prestado",
                    userId: allUsers[
                        faker.number.int({ min: 0, max: allUsers.length - 1 })
                    ].id,
                    bookId: allBooks[
                        faker.number.int({ min: 0, max: allBooks.length - 1 })
                    ].id,
                },
            })
        );
    }

    await Promise.all(loans);

    // Crear multas con datos falsos
    const fines = [];
    for (let i = 0; i < 50; i++) {
        fines.push(
            prisma.fines.create({
                data: {
                    monto: faker.number.float({ min: 1, max: 100 }),
                    pagada: faker.datatype.boolean(),
                    fecha_multa: faker.date.past(),
                    userId: allUsers[
                        faker.number.int({ min: 0, max: allUsers.length - 1 })
                    ].id,
                },
            })
        );
    }

    await Promise.all(fines);

    console.log("Datos de ejemplo creados");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
