import { Router } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import scheduleRouter from './schedule.routes';
import attendanceRouter from './attendance.routes';
import { specialtyRouter } from './specialty.routes';
import fabricanteRouter from './fabricanteRoutes';
import medicamentoRouter from './medicamentoRoutes';
import vitalSignsRouter from './vitalSigns.routes';
import medicalCertificateRouter from './medicalCertificate.routes';
import medicationRouter from './medication.routes';
import medicalExamRouter from './medicalExam.routes';
import clinicalNoteRouter from './clinicalNote.routes';
import allergyRouter from './allergy.routes';
import patientRouter from './patient.routes';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const routes = Router();

// Rotas públicas
routes.use('/auth', authRouter);

// Middleware de autenticação para todas as rotas abaixo
routes.use(verificarAutenticacao);

// Rotas protegidas
routes.use('/users', userRouter);
routes.use('/patients', patientRouter);
routes.use('/schedule', scheduleRouter);
routes.use('/attendance', attendanceRouter);
routes.use('/specialties', specialtyRouter);
routes.use('/fabricantes', fabricanteRouter);
routes.use('/medicamentos', medicamentoRouter);
routes.use('/vital-signs', vitalSignsRouter);
routes.use('/medical-certificates', medicalCertificateRouter);
routes.use('/medications', medicationRouter);
routes.use('/medical-exams', medicalExamRouter);
routes.use('/clinical-notes', clinicalNoteRouter);
routes.use('/allergies', allergyRouter);

export default routes; 