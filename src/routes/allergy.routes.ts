import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AllergyService } from '../services/AllergyService';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const allergyRouter = Router();
const prisma = new PrismaClient();
const allergyService = new AllergyService(prisma);

// Middleware de autenticação para todas as rotas
allergyRouter.use(verificarAutenticacao);

// Criar nova alergia
allergyRouter.post('/', async (req, res) => {
  const data = req.body;
  const allergy = await allergyService.create(data);
  return res.status(201).json(allergy);
});

// Buscar alergias por ID do usuário
allergyRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const allergies = await allergyService.findByUserId(userId);
  return res.json(allergies);
});

// Buscar alergias ativas por ID do usuário
allergyRouter.get('/user/:userId/active', async (req, res) => {
  const { userId } = req.params;
  const allergies = await allergyService.findActiveByUserId(userId);
  return res.json(allergies);
});

// Atualizar alergia
allergyRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const allergy = await allergyService.update(id, data);
  return res.json(allergy);
});

// Desativar alergia
allergyRouter.put('/:id/deactivate', async (req, res) => {
  const { id } = req.params;
  const allergy = await allergyService.deactivate(id);
  return res.json(allergy);
});

// Deletar alergia
allergyRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await allergyService.delete(id);
  return res.status(204).send();
});

export default allergyRouter; 