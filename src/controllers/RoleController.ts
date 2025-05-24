import { Request, Response } from 'express';
import { RoleService } from '../services/RoleService';

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  /**
   * Obter todas as roles do sistema
   */
  async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await this.roleService.getAllRoles();
      return res.json(roles);
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erro ao buscar roles',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Buscar role por ID
   */
  async getRoleById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const role = await this.roleService.getRoleById(id);
      return res.json(role);
    } catch (error) {
      return res.status(404).json({ 
        error: 'Role não encontrada',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 