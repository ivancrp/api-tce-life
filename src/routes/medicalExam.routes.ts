import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { MedicalExamService } from '../services/MedicalExamService';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const medicalExamRouter = Router();
const prisma = new PrismaClient();
const medicalExamService = new MedicalExamService(prisma);

// Middleware de autenticação para todas as rotas
medicalExamRouter.use(verificarAutenticacao);

// Criar novo exame
medicalExamRouter.post('/', async (req, res) => {
  try {
    console.log('[MedicalExam] Recebendo requisição para criar exame:', {
      body: req.body,
      headers: req.headers
    });

    const data = req.body;
    console.log('[MedicalExam] Dados processados:', data);

    const exam = await medicalExamService.create(data);
    console.log('[MedicalExam] Exame criado com sucesso:', exam);

    return res.status(201).json(exam);
  } catch (error: any) {
    console.error('[MedicalExam] Erro ao criar exame:', {
      message: error.message,
      stack: error.stack
    });
    return res.status(400).json({ 
      error: true, 
      message: error.message || 'Erro ao criar exame médico',
      details: error.stack
    });
  }
});

// Buscar exames por ID do usuário
medicalExamRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const exams = await medicalExamService.findByUserId(userId);
  return res.json(exams);
});

// Buscar exames pendentes por ID do usuário
medicalExamRouter.get('/user/:userId/pending', async (req, res) => {
  const { userId } = req.params;
  const exams = await medicalExamService.findPendingByUserId(userId);
  return res.json(exams);
});

// Buscar exames por ID do atendimento
medicalExamRouter.get('/attendance/:attendanceId', async (req, res) => {
  const { attendanceId } = req.params;
  const exams = await medicalExamService.findByAttendanceId(attendanceId);
  return res.json(exams);
});

// Atualizar exame
medicalExamRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const exam = await medicalExamService.update(id, data);
  return res.json(exam);
});

// Deletar exame
medicalExamRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await medicalExamService.delete(id);
  return res.status(204).send();
});

export default medicalExamRouter; 