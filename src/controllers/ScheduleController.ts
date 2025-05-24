import { Request, Response } from 'express';
import { ScheduleService } from '../services/ScheduleService';

export class ScheduleController {
  private scheduleService: ScheduleService;

  constructor() {
    this.scheduleService = new ScheduleService();
  }

  /**
   * Listar todos os agendamentos
   */
  async getAllSchedules(req: Request, res: Response) {
    try {
      console.log('Iniciando busca de todos os agendamentos...');
      
      if (!req.usuario) {
        console.error('Usuário não autenticado');
        return res.status(401).json({
          error: 'Não autorizado',
          message: 'Usuário não autenticado'
        });
      }
      
      const schedules = await this.scheduleService.getAllSchedules();
      console.log(`${schedules.length} agendamentos encontrados`);
      
      return res.json(schedules);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar agendamentos',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Buscar agendamentos por ID do usuário
   */
  async getSchedulesByUserId(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const schedules = await this.scheduleService.getSchedulesByUserId(userId);
      return res.json(schedules);
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erro ao buscar agendamentos do usuário',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Buscar agendamentos por ID do paciente (método legado para compatibilidade)
   */
  async getSchedulesByPatientId(req: Request, res: Response) {
    const { patientId } = req.params;

    try {
      // Buscar o usuário associado ao paciente
      const user = await this.scheduleService.getUserByPatientId(patientId);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado para o paciente especificado',
          message: 'Não foi possível encontrar um usuário associado a este paciente'
        });
      }
      
      // Usar o ID do usuário para buscar os agendamentos
      const schedules = await this.scheduleService.getSchedulesByUserId(user.id);
      return res.json(schedules);
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erro ao buscar agendamentos do paciente',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Buscar agendamentos por ID do médico
   */
  async getSchedulesByDoctorId(req: Request, res: Response) {
    const { doctorId } = req.params;

    try {
      const schedules = await this.scheduleService.getSchedulesByDoctorId(doctorId);
      return res.json(schedules);
    } catch (error) {
      return res.status(500).json({ 
        error: 'Erro ao buscar agendamentos do médico',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Buscar agendamento por ID
   */
  async getScheduleById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const schedule = await this.scheduleService.getScheduleById(id);
      return res.json(schedule);
    } catch (error) {
      return res.status(404).json({ 
        error: 'Agendamento não encontrado',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Criar um novo agendamento
   */
  async createSchedule(req: Request, res: Response) {
    const scheduleData = req.body;

    try {
      const schedule = await this.scheduleService.createSchedule(scheduleData);
      return res.status(201).json(schedule);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro ao criar agendamento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Atualizar um agendamento
   */
  async updateSchedule(req: Request, res: Response) {
    const { id } = req.params;
    const scheduleData = req.body;

    try {
      const updatedSchedule = await this.scheduleService.updateSchedule(id, scheduleData);
      return res.json(updatedSchedule);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro ao atualizar agendamento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Cancelar um agendamento
   */
  async cancelSchedule(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const canceledSchedule = await this.scheduleService.cancelSchedule(id);
      return res.json(canceledSchedule);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro ao cancelar agendamento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Confirmar um agendamento
   */
  async confirmSchedule(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const confirmedSchedule = await this.scheduleService.confirmSchedule(id);
      return res.json(confirmedSchedule);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro ao confirmar agendamento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Completar um agendamento
   */
  async completeSchedule(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const completedSchedule = await this.scheduleService.completeSchedule(id);
      return res.json(completedSchedule);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro ao completar agendamento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 