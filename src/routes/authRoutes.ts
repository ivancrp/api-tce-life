import { Router } from 'express';
import { verificarPermissao } from '../middleware/auth';
import { TipoUsuario } from '../types/auth';

const router = Router();

// Rota para médicos
router.get('/medicos', verificarPermissao('Médico'), (req, res) => {
  res.json({ message: 'Acesso permitido para médicos' });
});

// Rota para recepcionistas
router.get('/recepcionistas', verificarPermissao('Recepcionista'), (req, res) => {
  res.json({ message: 'Acesso permitido para recepcionistas' });
});

// Rota para administradores
router.get('/admin', verificarPermissao('Admin'), (req, res) => {
  res.json({ message: 'Acesso permitido para administradores' });
});

// Rota para pacientes
router.get('/pacientes', verificarPermissao('Paciente'), (req, res) => {
  res.json({ message: 'Acesso permitido para pacientes' });
});

export default router; 