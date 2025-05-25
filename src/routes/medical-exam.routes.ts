import { Router } from 'express';
import multer from 'multer';
import { MedicalExamController } from '../controllers/MedicalExamController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const medicalExamRouter = Router();
const medicalExamController = new MedicalExamController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Criar um novo exame
medicalExamRouter.post('/', ensureAuthenticated, medicalExamController.create);

// Upload de arquivos do exame
medicalExamRouter.post(
  '/:examId/upload',
  ensureAuthenticated,
  upload.array('files'),
  medicalExamController.uploadFiles
);

// Buscar exames por atendimento
medicalExamRouter.get(
  '/attendance/:attendanceId',
  ensureAuthenticated,
  medicalExamController.getByAttendanceId
);

// Atualizar status do exame
medicalExamRouter.patch(
  '/:examId',
  ensureAuthenticated,
  medicalExamController.update
);

// Rota para buscar exames por usuário
medicalExamRouter.get('/user/:userId', ensureAuthenticated, medicalExamController.getByUserId);

export default medicalExamRouter; 