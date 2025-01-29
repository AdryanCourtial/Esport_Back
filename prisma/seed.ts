import { prisma } from "../lib/prisma";  

async function main() {
  await prisma.gameType.createMany({
    data: [
      { name: "SOLO" },
      { name: "MULTIPLAYER" },
    ],
  });

  console.log("Types de jeu ajoutés avec succès !");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })