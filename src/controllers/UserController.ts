import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Listar todos os usuários
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      console.log('Buscando todos os usuários...');
      const users = await this.userService.getAllUsers();
      console.log(`${users.length} usuários encontrados`);
      return res.json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar usuários',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Listar todos os médicos
   */
  async getAllDoctors(req: Request, res: Response) {
    try {
      console.log('Buscando todos os médicos...');
      console.log('Usuário da requisição:', req.usuario);
      
      if (!req.usuario) {
        console.error('Usuário não autenticado');
        return res.status(401).json({
          error: 'Não autorizado',
          message: 'Usuário não autenticado'
        });
      }
      
      const doctors = await this.userService.getUsersByRole('Médico');
      console.log(`${doctors.length} médicos encontrados`);
      
      // Filtrar apenas os campos necessários
      const filteredDoctors = doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        profilePicture: doctor.profilePicture,
        role: {
          id: doctor.role.id,
          name: doctor.role.name
        },
        isActive: doctor.isActive,
        dateOfBirth: doctor.dateOfBirth,
        gender: doctor.gender,
        insurance: doctor.insurance,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt
      }));
      
      return res.json(filteredDoctors);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      
      if (error instanceof Error && error.message.includes('Role não encontrada')) {
        return res.status(404).json({
          error: 'Role não encontrada',
          message: 'A role de médico não está cadastrada no sistema'
        });
      }
      
      return res.status(500).json({ 
        error: 'Erro ao buscar médicos',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Buscar usuário por ID
   */
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      console.log(`Buscando usuário com ID ${id}...`);
      
      if (!req.usuario) {
        console.error('Usuário não autenticado');
        return res.status(401).json({
          error: 'Não autorizado',
          message: 'Usuário não autenticado'
        });
      }
      
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        console.log(`Usuário ${id} não encontrado`);
        return res.status(404).json({
          error: 'Usuário não encontrado',
          message: 'O usuário solicitado não existe'
        });
      }
      
      console.log('Usuário encontrado:', user.id);
      return res.json(user);
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      return res.status(500).json({ 
        error: 'Erro ao buscar usuário',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Criar um novo usuário
   */
  async createUser(req: Request, res: Response) {
    const userData = req.body;

    try {
      console.log('Criando novo usuário:', userData);
      const user = await this.userService.createUser(userData);
      console.log('Usuário criado:', user.id);
      return res.status(201).json(user);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(400).json({ 
        error: 'Erro ao criar usuário',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Buscar usuários por role
   */
  async getUsersByRole(req: Request, res: Response) {
    const { roleName } = req.params;

    try {
      console.log(`Buscando usuários com role ${roleName}...`);
      
      if (!req.usuario) {
        console.error('Usuário não autenticado');
        return res.status(401).json({
          error: 'Não autorizado',
          message: 'Usuário não autenticado'
        });
      }
      
      const users = await this.userService.getUsersByRole(roleName);
      console.log(`${users.length} usuários encontrados com role ${roleName}`);
      return res.json(users);
    } catch (error) {
      console.error(`Erro ao buscar usuários com role ${roleName}:`, error);
      return res.status(500).json({
        error: 'Erro ao buscar usuários',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Atualizar um usuário
   */
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const userData = req.body;

    try {
      console.log(`Atualizando usuário ${id}:`, userData);
      
      if (!req.usuario) {
        console.error('Usuário não autenticado');
        return res.status(401).json({
          error: 'Não autorizado',
          message: 'Usuário não autenticado'
        });
      }
      
      const updatedUser = await this.userService.updateUser(id, userData);
      console.log('Usuário atualizado:', updatedUser.id);
      return res.json(updatedUser);
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      return res.status(400).json({ 
        error: 'Erro ao atualizar usuário',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Desativar um usuário
   */
  async deactivateUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      console.log(`Desativando usuário ${id}...`);
      
      if (!req.usuario) {
        console.error('Usuário não autenticado');
        return res.status(401).json({
          error: 'Não autorizado',
          message: 'Usuário não autenticado'
        });
      }
      
      const deactivatedUser = await this.userService.deactivateUser(id);
      console.log('Usuário desativado:', deactivatedUser.id);
      return res.json(deactivatedUser);
    } catch (error) {
      console.error(`Erro ao desativar usuário ${id}:`, error);
      return res.status(400).json({
        error: 'Erro ao desativar usuário',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Excluir um usuário
   */
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      console.log(`Excluindo usuário ${id}...`);
      
      if (!req.usuario) {
        console.error('Usuário não autenticado');
        return res.status(401).json({
          error: 'Não autorizado',
          message: 'Usuário não autenticado'
        });
      }
      
      await this.userService.deleteUser(id);
      console.log(`Usuário ${id} excluído com sucesso`);
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao excluir usuário ${id}:`, error);
      return res.status(400).json({ 
        error: 'Erro ao excluir usuário',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 