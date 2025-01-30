import { prisma } from "../lib/prisma";  

async function main() {
  await prisma.gameType.createMany({
    data: [
      { name: "SOLO" },
      { name: "MULTIPLAYER" },
    ],
  });
  await prisma.role.createMany({
    data: [
      { role: "ADMIN" },
      { role: "USER"}
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