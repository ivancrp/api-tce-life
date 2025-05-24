import { Router } from 'express';
import userRoutes from './user.routes';
import patientRoutes from './patient.routes';
import attendanceRoutes from './attendance.routes';
import prescriptionRoutes from './prescription.routes';
import certificateRoutes from './certificate.routes';
import scheduleRoutes from './schedule.routes';
import roleRoutes from './role.routes';
import medicamentoRoutes from './medicamentoRoutes';
import fabricanteRoutes from './fabricanteRoutes';
import { specialtyRouter } from './specialty.routes';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const routes = Router();

// Middleware de autenticação global para todas as rotas
routes.use(verificarAutenticacao);

routes.use('/users', userRoutes);
routes.use('/patients', patientRoutes);
routes.use('/attendances', attendanceRoutes);
routes.use('/prescriptions', prescriptionRoutes);
routes.use('/certificates', certificateRoutes);
routes.use('/schedules', scheduleRoutes);
routes.use('/roles', roleRoutes);
routes.use('/specialties', specialtyRouter);

// Rotas de medicamentos
routes.use('/', medicamentoRoutes);

// Rotas de fabricantes
routes.use('/fabricantes', fabricanteRoutes);

export default routes; 