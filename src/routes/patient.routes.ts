import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de pacientes' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar paciente' });
});

export default router; 