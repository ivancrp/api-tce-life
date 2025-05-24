import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AttendanceService } from '../services/AttendanceService';

const router = Router();
const prisma = new PrismaClient();
const attendanceService = new AttendanceService(prisma);

// Listar todos os atendimentos
router.get('/', async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        user: true,
        prescriptions: true,
        certificates: true
      }
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atendimentos' });
  }
});

// Iniciar um atendimento (deve vir antes das rotas com parâmetros)
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

// Criar um novo atendimento
router.post('/', async (req, res) => {
  try {
    const attendance = await attendanceService.create(req.body);
    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Atualizar um atendimento
router.put('/:id', async (req, res) => {
  try {
    const attendance = await attendanceService.update(req.params.id, req.body);
    res.json(attendance);
  } catch (error: any) {
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

export default router; 