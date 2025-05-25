import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AttendanceService } from '../services/AttendanceService';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const attendanceService = new AttendanceService(prisma);

// Aplicar middleware de autenticação para todas as rotas
router.use(verificarAutenticacao);

// Listar todos os atendimentos
router.get('/', async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        patient: true,
        doctor: true,
        prescriptions: true,
        certificates: true
      }
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atendimentos' });
  }
});

// Criar um novo atendimento
router.post('/', async (req, res) => {
  try {
    const attendance = await attendanceService.create(req.body);
    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Iniciar um atendimento
router.post('/start', async (req, res) => {
  try {
    console.log('Recebida requisição para iniciar atendimento:', {
      body: req.body,
      headers: req.headers,
      user: req.usuario
    });

    const { scheduleId } = req.body;
    
    if (!scheduleId) {
      console.log('scheduleId não fornecido');
      return res.status(400).json({ message: 'scheduleId é obrigatório' });
    }

    console.log('Iniciando atendimento para scheduleId:', scheduleId);
    const attendance = await attendanceService.startAttendance(scheduleId);
    console.log('Atendimento iniciado com sucesso:', attendance);
    
    res.status(201).json(attendance);
  } catch (error: any) {
    console.error('Erro ao iniciar atendimento:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Rota para estatísticas
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    
    const [atendimentosHoje, atendimentosSemana] = await Promise.all([
      // Atendimentos de hoje
      prisma.attendance.count({
        where: {
          createdAt: {
            gte: startOfDay(now),
            lte: endOfDay(now)
          }
        }
      }),
      // Atendimentos da semana
      prisma.attendance.count({
        where: {
          createdAt: {
            gte: startOfWeek(now),
            lte: endOfWeek(now)
          }
        }
      })
    ]);

    // Buscar atendimentos da semana com dados do médico
    const atendimentosSemanaDetalhes = await prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: startOfWeek(now),
          lte: endOfWeek(now)
        }
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialties: {
              include: {
                specialty: true
              }
            }
          }
        }
      }
    });

    // Agrupar por especialidade
    const especialidadesMap = new Map<string, number>();
    atendimentosSemanaDetalhes.forEach(atendimento => {
      const especialidade = atendimento.doctor?.specialties[0]?.specialty?.name || 'Não especificada';
      especialidadesMap.set(
        especialidade, 
        (especialidadesMap.get(especialidade) || 0) + 1
      );
    });

    // Converter para o formato esperado
    const especialidades = Array.from(especialidadesMap.entries()).map(([nome, quantidade]) => ({
      nome,
      quantidade
    }));

    return res.json({
      atendimentosHoje,
      atendimentosSemana,
      especialidades
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Buscar atendimento por ID do agendamento
router.get('/schedule/:scheduleId', async (req, res) => {
  try {
    const attendance = await attendanceService.findByScheduleId(req.params.scheduleId);
    res.json(attendance);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Buscar atendimentos por ID do paciente
router.get('/patient/:patientId', async (req, res) => {
  try {
    const attendances = await attendanceService.findByPatientId(req.params.patientId);
    res.json(attendances);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Buscar atendimento por ID
router.get('/:id', async (req, res) => {
  try {
    const attendance = await attendanceService.findById(req.params.id);
    res.json(attendance);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Atualizar um atendimento
router.put('/:id', async (req, res) => {
  try {
    console.log('Recebida requisição para atualizar atendimento:', {
      id: req.params.id,
      body: req.body
    });

    const attendance = await attendanceService.update(req.params.id, req.body);
    console.log('Atendimento atualizado com sucesso:', attendance);
    res.json(attendance);
  } catch (error: any) {
    console.error('Erro ao atualizar atendimento:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Finalizar um atendimento
router.put('/:id/complete', async (req, res) => {
  try {
    const attendance = await attendanceService.complete(req.params.id);
    res.json(attendance);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Cancelar um atendimento
router.put('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'O motivo do cancelamento é obrigatório' });
    }
    const attendance = await attendanceService.cancel(req.params.id, reason);
    res.json(attendance);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router; 