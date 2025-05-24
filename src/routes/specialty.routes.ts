import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verificarAutenticacao } from '../middlewares/authMiddleware';

const specialtyRouter = Router();
const prisma = new PrismaClient();

// Listar todas as especialidades
specialtyRouter.get('/', verificarAutenticacao, async (req, res) => {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return res.json(specialties);
  } catch (error) {
    console.error('Erro ao listar especialidades:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar uma nova especialidade
specialtyRouter.post('/', verificarAutenticacao, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
    }

    const existingSpecialty = await prisma.specialty.findUnique({
      where: { name }
    });

    if (existingSpecialty) {
      return res.status(400).json({ error: 'Especialidade já existe' });
    }

    const specialty = await prisma.specialty.create({
      data: {
        name,
        description
      }
    });

    return res.status(201).json(specialty);
  } catch (error) {
    console.error('Erro ao criar especialidade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atribuir especialidade a um usuário
specialtyRouter.post('/assign', verificarAutenticacao, async (req, res) => {
  try {
    const { userId, specialties } = req.body;

    if (!userId || !specialties || !Array.isArray(specialties)) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    // Primeiro, remove todas as especialidades existentes do usuário
    await prisma.userSpecialty.deleteMany({
      where: { userId }
    });

    // Depois, adiciona as novas especialidades
    const userSpecialties = await Promise.all(
      specialties.map(specialtyId =>
        prisma.userSpecialty.create({
          data: {
            userId,
            specialtyId
          }
        })
      )
    );

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        specialties: {
          include: {
            specialty: true
          }
        }
      }
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atribuir especialidades:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar usuários com suas especialidades
specialtyRouter.get('/users', verificarAutenticacao, async (req, res) => {
  try {
    console.log('Requisição para /specialties/users recebida');
    console.log('Headers da requisição:', req.headers);
    console.log('Usuário autenticado:', req.usuario);

    const users = await prisma.user.findMany({
      include: {
        specialties: {
          include: {
            specialty: true
          }
        },
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('Usuários encontrados:', users.length);

    const formattedUsers = users.map(user => ({
      ...user,
      role: user.role.name,
      specialties: user.specialties.map(us => us.specialty)
    }));

    console.log('Usuários formatados:', formattedUsers.length);
    return res.json(formattedUsers);
  } catch (error) {
    console.error('Erro ao listar usuários com especialidades:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { specialtyRouter }; 