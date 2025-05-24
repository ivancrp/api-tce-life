const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testando conexão com o Prisma Client...');
    
    // Teste simples - buscar todos os usuários
    const users = await prisma.user.findMany({
      include: { role: true }
    });
    
    console.log(`Conexão bem-sucedida! Encontrados ${users.length} usuários.`);
    console.log('Primeiro usuário:', users[0].name);
  } catch (error) {
    console.error('Erro ao conectar com o Prisma Client:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 