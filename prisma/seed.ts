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
      { name: "3D, Animation & Jeux video" },
      { name: "Architecture d'interieur" },
      { name: "Audiovisuel" },
      { name: "Batiment numerique" },
      { name: "Creation & Digital Design" },
      { name: "Cybersécurite" },
      { name: "Illustration" },
      { name: "Informatique" },
      { name: "Intelligence Artificielle & Data" },
      { name: "Marketing & Communication Digitale" },
      { name: "Son & Musique" },
      { name: "Tech & Business" },
    ],
 });
await prisma.game.createMany({
  data: [
    {
      name: 'Rocket League',
      image_url: 'https://mediatheques.niortagglo.fr/sites/default/files/2023-06/Rocket%20league.jpg',
  },
    {
      name: 'Valorant',
      image_url: 'https://gamecover.fr/wp-content/uploads/Valorant-mise-en-avant.jpeg',
    },
    {
      name: 'League of Legends',
      image_url: 'https://www.pedagojeux.fr/wp-content/uploads/2019/11/1280x720_LoL.jpg',
    },
    {
      name: 'Smash Bros Ultimate',
      image_url: 'https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_nSwitch_SuperSmashBrosUltimate_02.jpg',
    },
    {
      name: 'Mario Kart',
      image_url: 'https://static.fnac-static.com/multimedia/Images/FD/Comete/87087/CCP_IMG_1200x800/1101788.jpg',
    }
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