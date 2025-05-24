import { PrismaClient, Prisma } from '@prisma/client';
import { RoleService } from './RoleService';

const prisma = new PrismaClient();
const roleService = new RoleService();

// Definição do tipo User para uso interno
interface User {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  profilePicture?: string | null;
  isActive: boolean;
  roleId: string;
  dateOfBirth?: Date | null;
  gender?: string | null;
  insurance?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: any;
}

interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePicture?: string;
  roleName?: string;
  dateOfBirth?: Date;
  gender?: string;
  insurance?: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
  roleId?: string;
  isActive?: boolean;
  dateOfBirth?: Date;
  gender?: string;
  insurance?: string;
}

export class UserService {
  /**
   * Criar um novo usuário
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      console.log('Iniciando criação de usuário:', { ...userData, password: '***' });
      
      // Se não for especificada uma role, usar 'Paciente' como padrão
      const roleName = userData.roleName || 'Paciente';
      console.log('Role do usuário:', roleName);
      
      // Buscar a role pelo nome
      const role = await roleService.getRoleByName(roleName);
      console.log('Role encontrada:', role);
      
      // Criar o usuário com a role indicada
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          googleId: userData.googleId,
          profilePicture: userData.profilePicture,
          roleId: role.id,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          insurance: userData.insurance,
          isActive: true
        },
        include: {
          role: true
        }
      });
      
      console.log('Usuário criado com sucesso:', { id: user.id, email: user.email });
      return user;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Já existe um usuário com este email');
        }
      }
      
      throw new Error('Não foi possível criar o usuário');
    }
  }

  /**
   * Buscar usuário por ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      console.log(`Buscando usuário com ID ${id}...`);
      
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          role: true
        }
      });
      
      if (user) {
        console.log('Usuário encontrado:', { id: user.id, email: user.email });
      } else {
        console.log('Usuário não encontrado');
      }
      
      return user;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw new Error('Não foi possível buscar o usuário');
    }
  }

  /**
   * Buscar usuário por email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      console.log(`Buscando usuário com email ${email}...`);
      
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          role: true
        }
      });
      
      if (user) {
        console.log('Usuário encontrado:', { id: user.id, email: user.email });
      } else {
        console.log('Usuário não encontrado');
      }
      
      return user;
    } catch (error) {
      console.error(`Erro ao buscar usuário com email ${email}:`, error);
      throw new Error('Não foi possível buscar o usuário');
    }
  }

  /**
   * Buscar todos os usuários com uma role específica
   */
  async getUsersByRole(roleName: string) {
    try {
      console.log(`Buscando usuários com role ${roleName}...`);
      
      const role = await roleService.getRoleByName(roleName);
      console.log('Role encontrada:', role);
      
      const users = await prisma.user.findMany({
        where: {
          roleId: role.id,
          isActive: true
        },
        include: {
          role: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      console.log(`${users.length} usuários encontrados com role ${roleName}`);
      return users;
    } catch (error) {
      console.error(`Erro ao buscar usuários com role ${roleName}:`, error);
      
      if (error instanceof Error && error.message.includes('Role não encontrada')) {
        throw new Error(`Role '${roleName}' não encontrada no sistema`);
      }
      
      throw new Error('Não foi possível buscar os usuários');
    }
  }

  /**
   * Atualizar um usuário
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      console.log(`Atualizando usuário ${id}:`, { ...userData, password: userData.password ? '***' : undefined });
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: userData,
        include: {
          role: true
        }
      });
      
      console.log('Usuário atualizado:', { id: updatedUser.id, email: updatedUser.email });
      return updatedUser;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Usuário não encontrado');
        }
        if (error.code === 'P2002') {
          throw new Error('Já existe um usuário com este email');
        }
      }
      
      throw new Error('Não foi possível atualizar o usuário');
    }
  }

  /**
   * Desativar um usuário (soft delete)
   */
  async deactivateUser(id: string): Promise<User> {
    try {
      console.log(`Desativando usuário ${id}...`);
      
      const deactivatedUser = await prisma.user.update({
        where: { id },
        data: {
          isActive: false
        },
        include: {
          role: true
        }
      });
      
      console.log('Usuário desativado:', { id: deactivatedUser.id, email: deactivatedUser.email });
      return deactivatedUser;
    } catch (error) {
      console.error(`Erro ao desativar usuário ${id}:`, error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Usuário não encontrado');
        }
      }
      
      throw new Error('Não foi possível desativar o usuário');
    }
  }

  /**
   * Obter todos os usuários
   */
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('Buscando todos os usuários...');
      
      const users = await prisma.user.findMany({
        where: {
          isActive: true
        },
        include: {
          role: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      console.log(`${users.length} usuários encontrados`);
      return users;
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      throw new Error('Não foi possível buscar os usuários');
    }
  }

  /**
   * Excluir um usuário
   */
  async deleteUser(id: string): Promise<void> {
    try {
      console.log(`Excluindo usuário ${id}...`);
      
      await prisma.user.delete({
        where: { id }
      });
      
      console.log(`Usuário ${id} excluído com sucesso`);
    } catch (error) {
      console.error(`Erro ao excluir usuário ${id}:`, error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Usuário não encontrado');
        }
      }
      
      throw new Error('Não foi possível excluir o usuário');
    }
  }
} 