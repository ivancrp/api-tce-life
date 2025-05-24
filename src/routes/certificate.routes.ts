import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de atestados' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar atestado' });
});

export default router; 