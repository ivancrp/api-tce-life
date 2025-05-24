import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRoutes = Router();
const userController = new UserController();

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