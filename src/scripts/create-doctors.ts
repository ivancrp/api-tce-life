import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Obter o ID do papel de médico
    const medicoRole = await prisma.role.findUnique({
      where: { name: 'Médico' }
    });
    
    if (!medicoRole) {
      throw new Error('Role de Médico não encontrada');
    }
    
    // Dados dos médicos a serem criados
    const medicos = [
      {
        name: 'Dr. Carlos Ferreira',
        email: 'carlos.ferreira@tcelife.com.br',
        password: await bcrypt.hash('medico123', 10),
        profilePicture: 'https://randomuser.me/api/portraits/men/35.jpg',
        roleId: medicoRole.id,
        especialidade: 'Cardiologia'
      },
      {
        name: 'Dra. Ana Paula Souza',
        email: 'ana.souza@tcelife.com.br',
        password: await bcrypt.hash('medico123', 10),
        profilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
        roleId: medicoRole.id,
        especialidade: 'Dermatologia'
      },
      {
        name: 'Dr. Roberto Almeida',
        email: 'roberto.almeida@tcelife.com.br',
        password: await bcrypt.hash('medico123', 10),
        profilePicture: 'https://randomuser.me/api/portraits/men/62.jpg',
        roleId: medicoRole.id,
        especialidade: 'Clínica Geral'
      }
    ];
    
    for (const medico of medicos) {
      // Extrair a especialidade antes de criar o usuário
      const { especialidade, ...userData } = medico;
      
      // Usar upsert para criar ou atualizar
      const user = await prisma.user.upsert({
        where: { email: medico.email },
        update: userData,
        create: userData
      });
      
      console.log(`Médico(a) ${medico.name} criado(a) ou atualizado(a) com sucesso.`);
    }
    
    console.log('Criação de médicos concluída!');
    
    // Listar todos os médicos no sistema
    const doctorRole = await prisma.role.findUnique({
      where: { name: 'Médico' }
    });
    
    if (doctorRole) {
      const doctors = await prisma.user.findMany({
        where: { roleId: doctorRole.id }
      });
      
      console.log('\nMédicos no sistema:');
      doctors.forEach(doctor => {
        console.log(`- ${doctor.name} (${doctor.email})`);
      });
    }
  } catch (error) {
    console.error('Erro ao criar médicos:', error);
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