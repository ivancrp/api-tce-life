import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { VitalSignsService } from '../services/VitalSignsService';
import { verificarAutenticacao } from '../middlewares/authMiddleware';
import asyncHandler from '../middlewares/asyncHandler';

const vitalSignsRouter = Router();
const prisma = new PrismaClient();
const vitalSignsService = new VitalSignsService(prisma);

// Middleware de autenticação para todas as rotas
vitalSignsRouter.use(verificarAutenticacao);

// Criar novo registro de sinais vitais
vitalSignsRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const vitalSigns = await vitalSignsService.create(data);
  return res.status(201).json(vitalSigns);
}));

// Buscar sinais vitais por ID do usuário
vitalSignsRouter.get('/user/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const vitalSigns = await vitalSignsService.findByUserId(userId);
  return res.json(vitalSigns);
}));

// Buscar último registro de sinais vitais do usuário
vitalSignsRouter.get('/user/:userId/latest', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const vitalSigns = await vitalSignsService.findLatestByUserId(userId);
  return res.json(vitalSigns);
}));

// Buscar sinais vitais por ID do atendimento
vitalSignsRouter.get('/attendance/:attendanceId', asyncHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;
  const vitalSigns = await vitalSignsService.findByAttendanceId(attendanceId);
  return res.json(vitalSigns);
}));

// Atualizar registro de sinais vitais
vitalSignsRouter.put('/:id', async (req, res) => {
  try {
    const vitalSigns = await vitalSignsService.update(req.params.id, req.body);
    res.json(vitalSigns);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Deletar registro de sinais vitais
vitalSignsRouter.delete('/:id', async (req, res) => {
  try {
    await vitalSignsService.delete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default vitalSignsRouter; 