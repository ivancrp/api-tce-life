import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Obter o ID do papel de administrador
    const adminRole = await prisma.role.findUnique({
      where: { name: 'Administrador' }
    });
    
    if (!adminRole) {
      throw new Error('Role de Administrador não encontrada');
    }
    
    // Dados do administrador
    const adminData = {
      name: 'Administrador do Sistema',
      email: 'admin@tcelife.com.br',
      password: await bcrypt.hash('admin123', 10),
      profilePicture: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      roleId: adminRole.id,
      isActive: true
    };
    
    // Usar upsert para criar ou atualizar
    const admin = await prisma.user.upsert({
      where: { email: adminData.email },
      update: adminData,
      create: adminData
    });
    
    console.log(`Administrador criado ou atualizado com sucesso: ${admin.name} (${admin.email})`);
    console.log('Email: admin@tcelife.com.br');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 