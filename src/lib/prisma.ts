import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// Configuração do cliente Prisma com log detalhado em desenvolvimento
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Adicionar listener para desconexão no processo
process.on('beforeExit', async () => {
  console.log('Desconectando Prisma Client...');
  await prisma.$disconnect();
});

// Verificar conexão inicial
prisma.$connect()
  .then(() => {
    console.log('Prisma Client conectado com sucesso ao banco de dados');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  });

export default prisma; 