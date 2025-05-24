import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Tentando conectar ao banco de dados...');
    
    // Tenta uma operação simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    console.log('Conexão bem sucedida!');
    console.log('Resultado do teste:', result);

    // Tenta listar os usuários
    const users = await prisma.user.findMany();
    console.log('Número de usuários no banco:', users.length);
    
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 