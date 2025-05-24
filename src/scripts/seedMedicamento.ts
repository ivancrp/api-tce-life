import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Primeiro, verificar se existe um fabricante
    let fabricante = await prisma.fabricante.findFirst();
    
    // Se não existir, criar um fabricante padrão
    if (!fabricante) {
      fabricante = await prisma.fabricante.create({
        data: {
          nome: 'Fabricante Padrão',
          registroAnvisa: 'REG-0001'
        }
      });
    }

    // Criar o medicamento
    const medicamento = await prisma.medicamento.create({
      data: {
        nomeComercial: 'Paracetamol',
        nomeGenerico: 'Acetaminofeno',
        codigoInterno: 'MED001',
        apresentacao: 'Comprimido',
        formaFarmaceutica: 'Sólida',
        dosagem: '500mg',
        unidadeMedida: 'mg',
        registroAnvisa: '123456',
        lote: 'LOT001',
        dataFabricacao: new Date('2024-01-01'),
        dataValidade: new Date('2025-01-01'),
        quantidadeEstoque: 100,
        quantidadeMinima: 10,
        localArmazenamento: 'Estante A',
        condicoesArmazenamento: 'Temperatura ambiente',
        tipoControle: 'Uso comum',
        classificacaoTerapeutica: 'Analgésico',
        necessitaPrescricao: false,
        fabricanteId: fabricante.id
      }
    });

    console.log('Medicamento criado com sucesso:', medicamento);
  } catch (error) {
    console.error('Erro ao criar medicamento:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 