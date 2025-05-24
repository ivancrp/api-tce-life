import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ClinicalNoteService } from '../services/ClinicalNoteService';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const clinicalNoteRouter = Router();
const prisma = new PrismaClient();
const clinicalNoteService = new ClinicalNoteService(prisma);

// Middleware de autenticação para todas as rotas
clinicalNoteRouter.use(verificarAutenticacao);

// Criar nova anotação clínica
clinicalNoteRouter.post('/', async (req, res) => {
  const data = req.body;
  const note = await clinicalNoteService.create(data);
  return res.status(201).json(note);
});

// Buscar anotações por ID do usuário
clinicalNoteRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const notes = await clinicalNoteService.findByUserId(userId);
  return res.json(notes);
});

// Buscar anotações por ID do atendimento
clinicalNoteRouter.get('/attendance/:attendanceId', async (req, res) => {
  const { attendanceId } = req.params;
  const notes = await clinicalNoteService.findByAttendanceId(attendanceId);
  return res.json(notes);
});

// Buscar anotações por tipo
clinicalNoteRouter.get('/user/:userId/type/:type', async (req, res) => {
  const { userId, type } = req.params;
  const notes = await clinicalNoteService.findByType(userId, type);
  return res.json(notes);
});

// Atualizar anotação clínica
clinicalNoteRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const note = await clinicalNoteService.update(id, data);
  return res.json(note);
});

// Deletar anotação clínica
clinicalNoteRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await clinicalNoteService.delete(id);
  return res.status(204).send();
});

export default clinicalNoteRouter; 