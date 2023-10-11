
const {PrismaClient} = require("@prisma/client");

const db = new PrismaClient();


async function main() {
  try{
    await db.category.createMany({
      data: [
        {
          name: "Programacion",
        },
        {
          name: "Musica",
        },
        {
          name: "Audiovisual",
        },
        {
          name: "Cocina",
        },
        {
          name: "Fitness",
        },
        {
          name: "Ingenieria",
        }
      ]
    })
    console.log("sccs")
  } catch (err) {
    console.log("Error en seeding...")
  } finally {
    await db.$disconnect
  }
}

main();