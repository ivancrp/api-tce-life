import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const specialties = [
    {
      name: 'Dentista',
      description: 'Profissional especializado em saúde bucal, diagnóstico e tratamento de doenças dos dentes e gengivas.'
    },
    {
      name: 'Fisioterapeuta',
      description: 'Profissional dedicado à reabilitação física e tratamento de distúrbios do movimento.'
    },
    {
      name: 'Psicóloga',
      description: 'Profissional especializada em saúde mental, avaliação psicológica e tratamento de distúrbios emocionais e comportamentais.'
    }
  ];

  console.log('Iniciando seed de especialidades...');

  for (const specialty of specialties) {
    const existingSpecialty = await prisma.specialty.findUnique({
      where: { name: specialty.name }
    });

    if (!existingSpecialty) {
      await prisma.specialty.create({
        data: specialty
      });
      console.log(`Especialidade criada: ${specialty.name}`);
    } else {
      console.log(`Especialidade já existe: ${specialty.name}`);
    }
  }

  console.log('Seed de especialidades concluído!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 