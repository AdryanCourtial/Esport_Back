import {prisma} from "../../lib/prisma";  // Assure-toi d'importer le client Prisma depuis ton fichier db/index.ts


export const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: { posts: true },  
  });
};
