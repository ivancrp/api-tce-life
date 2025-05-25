import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { PrismaClient } from '@prisma/client';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const userRoutes = Router();
const userController = new UserController();
const prisma = new PrismaClient();

// Middleware de autenticação
userRoutes.use(verificarAutenticacao);

// Rota para estatísticas (deve vir antes das rotas com parâmetros)
userRoutes.get('/stats', async (req, res) => {
  try {
    const [totalPacientes, novosPacientes, consultasAgendadas] = await Promise.all([
      // Total de pacientes
      prisma.user.count({
        where: {
          role: {
            name: 'Paciente'
          },
          isActive: true
        }
      }),
      // Novos pacientes no mês atual
      prisma.user.count({
        where: {
          role: {
            name: 'Paciente'
          },
          isActive: true,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      // Consultas agendadas
      prisma.schedule.count({
        where: {
          status: 'AGENDADO',
          date: {
            gte: new Date()
          }
        }
      })
    ]);

    return res.json({
      totalPacientes,
      novosPacientes,
      consultasAgendadas
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Listar todos os usuários
userRoutes.get('/', userController.getAllUsers.bind(userController));

// Listar todos os médicos
userRoutes.get('/doctors', userController.getAllDoctors.bind(userController));

// Buscar usuário por ID
userRoutes.get('/:id', userController.getUserById.bind(userController));

// Criar um novo usuário
userRoutes.post('/', userController.createUser.bind(userController));

// Atualizar um usuário
userRoutes.put('/:id', userController.updateUser.bind(userController));

// Excluir um usuário
userRoutes.delete('/:id', userController.deleteUser.bind(userController));

export default userRoutes; 