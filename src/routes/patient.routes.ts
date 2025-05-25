import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AllergyService } from '../services/AllergyService';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const allergyService = new AllergyService(prisma);

// Middleware de autenticação
router.use(verificarAutenticacao);

router.get('/', (req, res) => {
  res.json({ message: 'Lista de pacientes' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar paciente' });
});

// Rota para adicionar alergia a um paciente
router.post('/:id/allergies', async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { allergy } = req.body;

    const data = {
      userId,
      allergen: allergy,
      severity: 'N/A',
      reactions: 'N/A'
    };

    const createdAllergy = await allergyService.create(data);
    
    // Buscar o paciente atualizado com suas alergias
    const updatedPatient = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        allergies: {
          where: {
            active: true
          },
          select: {
            allergen: true
          }
        }
      }
    });

    if (!updatedPatient) {
      throw new Error('Paciente não encontrado');
    }

    // Transformar o paciente no formato esperado pelo frontend
    return res.status(201).json({
      ...updatedPatient,
      allergies: updatedPatient.allergies.map(a => a.allergen)
    });
  } catch (error: any) {
    console.error('Erro ao adicionar alergia:', error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Rota para listar alergias de um paciente
router.get('/:id/allergies', async (req, res) => {
  try {
    const { id: userId } = req.params;
    const allergies = await allergyService.findByUserId(userId);
    return res.json(allergies);
  } catch (error: any) {
    console.error('Erro ao buscar alergias:', error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Rota para adicionar medicamento em uso
router.post('/:id/medications', async (req, res) => {
  try {
    const { id: userId } = req.params;
    const medicationData = req.body;

    // Criar o registro do medicamento
    const createdMedication = await prisma.medication.create({
      data: {
        userId,
        name: medicationData.nome,
        dosage: medicationData.dosagem,
        frequency: medicationData.frequencia,
        startDate: new Date(medicationData.dataInicio),
        endDate: medicationData.dataFim ? new Date(medicationData.dataFim) : null,
        instructions: medicationData.instrucoes,
        active: medicationData.status === 'ativo',
        duration: medicationData.duration
      }
    });

    // Buscar o paciente atualizado com seus medicamentos
    const updatedPatient = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        medications: {
          where: {
            active: true
          }
        },
        allergies: {
          where: {
            active: true
          },
          select: {
            allergen: true
          }
        }
      }
    });

    if (!updatedPatient) {
      throw new Error('Paciente não encontrado');
    }

    // Transformar o paciente no formato esperado pelo frontend
    return res.status(201).json({
      ...updatedPatient,
      allergies: updatedPatient.allergies.map(a => a.allergen),
      medications: updatedPatient.medications.map(m => ({
        id: m.id,
        nome: m.name,
        dosagem: m.dosage,
        frequencia: m.frequency,
        dataInicio: m.startDate,
        dataFim: m.endDate,
        instrucoes: m.instructions || '',
        status: m.active ? 'ativo' : 'inativo',
        prescritoPor: 'Médico do Sistema'
      }))
    });
  } catch (error: any) {
    console.error('Erro ao adicionar medicamento:', error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Rota para listar medicamentos em uso
router.get('/:id/medications', async (req, res) => {
  try {
    const { id: userId } = req.params;
    const medications = await prisma.medication.findMany({
      where: {
        userId,
        active: true
      }
    });

    // Transformar os medicamentos no formato esperado pelo frontend
    const formattedMedications = medications.map(m => ({
      id: m.id,
      nome: m.name,
      dosagem: m.dosage,
      frequencia: m.frequency,
      dataInicio: m.startDate,
      dataFim: m.endDate,
      instrucoes: m.instructions || '',
      status: m.active ? 'ativo' : 'inativo',
      prescritoPor: 'Médico do Sistema'
    }));

    return res.json(formattedMedications);
  } catch (error: any) {
    console.error('Erro ao buscar medicamentos:', error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Rota para atualizar medicamento
router.put('/:id/medications/:medicationId', async (req, res) => {
  try {
    const { id: userId, medicationId } = req.params;
    const medicationData = req.body;

    const updatedMedication = await prisma.medication.update({
      where: {
        id: medicationId,
        userId
      },
      data: {
        name: medicationData.nome,
        dosage: medicationData.dosagem,
        frequency: medicationData.frequencia,
        startDate: medicationData.dataInicio ? new Date(medicationData.dataInicio) : undefined,
        endDate: medicationData.dataFim ? new Date(medicationData.dataFim) : null,
        instructions: medicationData.instrucoes,
        active: medicationData.status === 'ativo',
        duration: medicationData.duration
      }
    });

    // Buscar o paciente atualizado
    const updatedPatient = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        medications: {
          where: {
            active: true
          }
        },
        allergies: {
          where: {
            active: true
          },
          select: {
            allergen: true
          }
        }
      }
    });

    if (!updatedPatient) {
      throw new Error('Paciente não encontrado');
    }

    return res.json({
      ...updatedPatient,
      allergies: updatedPatient.allergies.map(a => a.allergen),
      medications: updatedPatient.medications.map(m => ({
        id: m.id,
        nome: m.name,
        dosagem: m.dosage,
        frequencia: m.frequency,
        dataInicio: m.startDate,
        dataFim: m.endDate,
        instrucoes: m.instructions || '',
        status: m.active ? 'ativo' : 'inativo',
        prescritoPor: 'Médico do Sistema'
      }))
    });
  } catch (error: any) {
    console.error('Erro ao atualizar medicamento:', error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Rota para remover medicamento
router.delete('/:id/medications/:medicationId', async (req, res) => {
  try {
    const { id: userId, medicationId } = req.params;

    // Ao invés de deletar, apenas marca como inativo
    await prisma.medication.update({
      where: {
        id: medicationId,
        userId
      },
      data: {
        active: false
      }
    });

    // Buscar o paciente atualizado
    const updatedPatient = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        medications: {
          where: {
            active: true
          }
        },
        allergies: {
          where: {
            active: true
          },
          select: {
            allergen: true
          }
        }
      }
    });

    if (!updatedPatient) {
      throw new Error('Paciente não encontrado');
    }

    return res.json({
      ...updatedPatient,
      allergies: updatedPatient.allergies.map(a => a.allergen),
      medications: updatedPatient.medications.map(m => ({
        id: m.id,
        nome: m.name,
        dosagem: m.dosage,
        frequencia: m.frequency,
        dataInicio: m.startDate,
        dataFim: m.endDate,
        instrucoes: m.instructions || '',
        status: m.active ? 'ativo' : 'inativo',
        prescritoPor: 'Médico do Sistema'
      }))
    });
  } catch (error: any) {
    console.error('Erro ao remover medicamento:', error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router; 