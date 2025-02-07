import { prisma } from "../lib/prisma";  

async function main() {
  await prisma.tournamentType.createMany({
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
 await prisma.sector.createMany({
    data: [
      { Name: "3D, Animation & Jeux vidéo" },
      { Name: "Architecture d'intérieur" },
      { Name: "Audiovisuel" },
      { Name: "Bâtiment Numérique" },
      { Name: "Création & Digital Design" },
      { Name: "Cybersécurité" },
      { Name: "Illustration" },
      { Name: "Informatique" },
      { Name: "Intelligence Artificielle & Data" },
      { Name: "Marketing & Communication Digitale" },
      { Name: "Son & Musique" },
      { Name: "Tech & Business" },
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