import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      }
    });
    
    console.log('Usuários encontrados:');
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erro ao consultar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 