import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { MedicalCertificateService } from '../services/MedicalCertificateService';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const medicalCertificateRouter = Router();
const prisma = new PrismaClient();
const medicalCertificateService = new MedicalCertificateService(prisma);

// Middleware de autenticação para todas as rotas
medicalCertificateRouter.use(verificarAutenticacao);

// Criar novo atestado médico
medicalCertificateRouter.post('/', async (req, res) => {
  const data = req.body;
  const certificate = await medicalCertificateService.create(data);
  return res.status(201).json(certificate);
});

// Buscar atestados por ID do usuário
medicalCertificateRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const certificates = await medicalCertificateService.findByUserId(userId);
  return res.json(certificates);
});

// Buscar atestados por ID do atendimento
medicalCertificateRouter.get('/attendance/:attendanceId', async (req, res) => {
  const { attendanceId } = req.params;
  const certificates = await medicalCertificateService.findByAttendanceId(attendanceId);
  return res.json(certificates);
});

// Buscar atestado por ID
medicalCertificateRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const certificate = await medicalCertificateService.findById(id);
  return res.json(certificate);
});

// Atualizar atestado médico
medicalCertificateRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const certificate = await medicalCertificateService.update(id, data);
  return res.json(certificate);
});

// Deletar atestado médico
medicalCertificateRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await medicalCertificateService.delete(id);
  return res.status(204).send();
});

export default medicalCertificateRouter; 