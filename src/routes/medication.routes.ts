import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { MedicationService } from '../services/MedicationService';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const medicationRouter = Router();
const prisma = new PrismaClient();
const medicationService = new MedicationService(prisma);

// Middleware de autenticação para todas as rotas
medicationRouter.use(verificarAutenticacao);

// Criar nova medicação
medicationRouter.post('/', async (req, res) => {
  const data = req.body;
  const medication = await medicationService.create(data);
  return res.status(201).json(medication);
});

// Buscar medicações por ID do usuário
medicationRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const medications = await medicationService.findByUserId(userId);
  return res.json(medications);
});

// Buscar medicações ativas por ID do usuário
medicationRouter.get('/user/:userId/active', async (req, res) => {
  const { userId } = req.params;
  const medications = await medicationService.findActiveByUserId(userId);
  return res.json(medications);
});

// Buscar medicações por ID do atendimento
medicationRouter.get('/attendance/:attendanceId', async (req, res) => {
  const { attendanceId } = req.params;
  const medications = await medicationService.findByAttendanceId(attendanceId);
  return res.json(medications);
});

// Atualizar medicação
medicationRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const medication = await medicationService.update(id, data);
  return res.json(medication);
});

// Desativar medicação
medicationRouter.put('/:id/deactivate', async (req, res) => {
  const { id } = req.params;
  const medication = await medicationService.deactivate(id);
  return res.json(medication);
});

// Deletar medicação
medicationRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await medicationService.delete(id);
  return res.status(204).send();
});

export default medicationRouter; 