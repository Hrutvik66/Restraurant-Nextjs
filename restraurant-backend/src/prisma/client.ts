import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// check if the prisma client is connected to the database
export const checkConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database through Prisma Client");
  } catch (error) {
    console.error("Failed to connect to the database through Prisma Client");
    console.error(error);
  }
};

export default prisma;
