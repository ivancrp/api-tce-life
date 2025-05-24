import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';

const scheduleRoutes = Router();
const scheduleController = new ScheduleController();

// Rotas para agendamentos
scheduleRoutes.get('/', scheduleController.getAllSchedules.bind(scheduleController));
scheduleRoutes.get('/user/:userId', scheduleController.getSchedulesByUserId.bind(scheduleController));
scheduleRoutes.get('/doctor/:doctorId', scheduleController.getSchedulesByDoctorId.bind(scheduleController));
scheduleRoutes.get('/:id', scheduleController.getScheduleById.bind(scheduleController));

scheduleRoutes.post('/', scheduleController.createSchedule.bind(scheduleController));
scheduleRoutes.put('/:id', scheduleController.updateSchedule.bind(scheduleController));
scheduleRoutes.patch('/:id/cancel', scheduleController.cancelSchedule.bind(scheduleController));
scheduleRoutes.patch('/:id/confirm', scheduleController.confirmSchedule.bind(scheduleController));
scheduleRoutes.patch('/:id/complete', scheduleController.completeSchedule.bind(scheduleController));

export default scheduleRoutes; 