# Server Wan Shi Tong

Pasos para Dev

1. Clonar el repositorio
2. Instalar dependencias `npm install`
3. Crear un archivo `.env` basado en el `.env.template` (cp .env.template .env)
5. Luego, ejecutar el comando `npx prisma migrate dev --name init` para generar la migracion de prisma
6. Ejecutar `node prisma/seed.js` para crear las semillas.
4. Por ultimo, correr el proyecto `npm run dev`