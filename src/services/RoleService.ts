import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RoleService {
  /**
   * Obter todas as roles do sistema
   */
  async getAllRoles() {
    try {
      console.log('Buscando todas as roles...');
      
      const roles = await prisma.role.findMany({
        orderBy: {
          name: 'asc'
        }
      });
      
      console.log(`${roles.length} roles encontradas`);
      return roles;
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      throw new Error('Não foi possível buscar as roles do sistema');
    }
  }

  /**
   * Buscar role por ID
   */
  async getRoleById(id: string) {
    try {
      console.log(`Buscando role com ID ${id}...`);
      
      const role = await prisma.role.findUnique({
        where: { id }
      });
      
      if (!role) {
        console.log(`Role ${id} não encontrada`);
        throw new Error('Role não encontrada');
      }
      
      console.log('Role encontrada:', role);
      return role;
    } catch (error) {
      console.error(`Erro ao buscar role ${id}:`, error);
      
      if (error instanceof Error && error.message === 'Role não encontrada') {
        throw error;
      }
      
      throw new Error('Não foi possível buscar a role solicitada');
    }
  }

  /**
   * Buscar role por nome (ignorando acentos e case, compatível com PostgreSQL)
   */
  async getRoleByName(name: string) {
    try {
      console.log(`Buscando role com nome '${name}'...`);
      
      // Validar o nome da role
      if (!name) {
        throw new Error('Nome da role não fornecido');
      }
      
      // Normalizar o nome da role
      const normalizedName = name.trim();
      if (normalizedName.length === 0) {
        throw new Error('Nome da role não pode estar vazio');
      }
      
      console.log('Executando query para buscar role...');
      const result = await prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM "roles" WHERE unaccent(name) ILIKE unaccent($1)`,
        `%${normalizedName}%`
      );
      
      const role = result[0];
      if (!role) {
        console.log(`Role '${name}' não encontrada`);
        throw new Error(`Role '${name}' não encontrada`);
      }
      
      console.log('Role encontrada:', role);
      return role;
    } catch (error) {
      console.error(`Erro ao buscar role ${name}:`, error);
      
      if (error instanceof Error) {
        if (error.message.includes('Role não encontrada')) {
          throw error;
        }
        if (error.message.includes('não fornecido') || error.message.includes('não pode estar vazio')) {
          throw error;
        }
      }
      
      throw new Error('Não foi possível buscar a role solicitada');
    }
  }
} 