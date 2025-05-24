import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.certificate.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('Dados existentes removidos com sucesso!');

  // Criar roles padrão
  const roles = [
    { name: 'ADMIN', description: 'Administrador do sistema' },
    { name: 'MEDICO', description: 'Médico' },
    { name: 'PACIENTE', description: 'Paciente' },
    { name: 'SECRETARIA', description: 'Secretária' }
  ];

  const createdRoles: Role[] = [];

  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name }
    });

    if (!existingRole) {
      const newRole = await prisma.role.create({
        data: role
      });
      createdRoles.push(newRole);
      console.log(`Role ${role.name} criada com sucesso`);
    } else {
      createdRoles.push(existingRole);
      console.log(`Role ${role.name} já existe`);
    }
  }

  // Verificar se todas as roles foram criadas
  if (createdRoles.length !== roles.length) {
    throw new Error('Falha ao criar todas as roles necessárias');
  }

  // Criar usuários de exemplo
  const users = [
    {
      name: 'Admin',
      email: 'admin@tce.com',
      password: await bcrypt.hash('admin123', 10),
      roleId: createdRoles.find(r => r.name === 'ADMIN')!.id,
      cpf: '12345678901',
      nomeSocial: null,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'M',
      naturalidade: 'Fortaleza-CE',
      nomeMae: 'Maria da Silva',
      nomePai: 'José da Silva',
      estadoCivil: 'SOLTEIRO',
      escolaridade: 'SUPERIOR_COMPLETO',
      telefone: '8533333333',
      celular: '85999999999',
      tipoSanguineo: 'O+',
      raca: 'BRANCO'
    },
    {
      name: 'Médico',
      email: 'medico@tce.com',
      password: await bcrypt.hash('medico123', 10),
      roleId: createdRoles.find(r => r.name === 'MEDICO')!.id,
      cpf: '98765432101',
      nomeSocial: null,
      dateOfBirth: new Date('1985-05-15'),
      gender: 'M',
      naturalidade: 'Fortaleza-CE',
      nomeMae: 'Ana Santos',
      nomePai: 'Pedro Santos',
      estadoCivil: 'CASADO',
      escolaridade: 'SUPERIOR_COMPLETO',
      telefone: '8533333334',
      celular: '85999999998',
      tipoSanguineo: 'A+',
      raca: 'PARDO'
    },
    {
      name: 'Secretária',
      email: 'secretaria@tce.com',
      password: await bcrypt.hash('secretaria123', 10),
      roleId: createdRoles.find(r => r.name === 'SECRETARIA')!.id,
      cpf: '45678912301',
      nomeSocial: null,
      dateOfBirth: new Date('1992-08-20'),
      gender: 'F',
      naturalidade: 'Fortaleza-CE',
      nomeMae: 'Clara Oliveira',
      nomePai: 'Roberto Oliveira',
      estadoCivil: 'SOLTEIRO',
      escolaridade: 'SUPERIOR_COMPLETO',
      telefone: '8533333335',
      celular: '85999999997',
      tipoSanguineo: 'B+',
      raca: 'PARDO'
    },
    {
      name: 'Paciente',
      email: 'paciente@tce.com',
      password: await bcrypt.hash('paciente123', 10),
      roleId: createdRoles.find(r => r.name === 'PACIENTE')!.id,
      cpf: '78912345601',
      nomeSocial: null,
      dateOfBirth: new Date('1995-03-10'),
      gender: 'M',
      naturalidade: 'Fortaleza-CE',
      nomeMae: 'Julia Costa',
      nomePai: 'Mario Costa',
      estadoCivil: 'SOLTEIRO',
      escolaridade: 'SUPERIOR_COMPLETO',
      telefone: '8533333336',
      celular: '85999999996',
      tipoSanguineo: 'AB+',
      raca: 'NEGRO'
    }
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: user
      });
      console.log(`Usuário ${user.email} criado com sucesso`);
    } else {
      console.log(`Usuário ${user.email} já existe`);
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 