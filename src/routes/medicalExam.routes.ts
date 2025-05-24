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
  const data = req.body;
  const exam = await medicalExamService.create(data);
  return res.status(201).json(exam);
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