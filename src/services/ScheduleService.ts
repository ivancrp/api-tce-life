import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateScheduleDto {
  userId: string;
  patientId?: string;
  doctorId: string;
  date: Date;
  time: string;
  type: string;
  notes?: string;
}

interface UpdateScheduleDto {
  date?: Date;
  time?: string;
  status?: string;
  type?: string;
  notes?: string;
}

export class ScheduleService {
  /**
   * Obter todos os agendamentos
   */
  async getAllSchedules() {
    try {
      console.log('Buscando agendamentos no banco de dados...');
      
      const schedules = await prisma.schedule.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: [
          {
            date: 'asc'
          },
          {
            time: 'asc'
          }
        ]
      });
      
      console.log(`Encontrados ${schedules.length} agendamentos`);
      console.log('Exemplo do primeiro agendamento:', schedules[0]);
      
      return schedules;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw new Error('Não foi possível buscar os agendamentos');
    }
  }

  /**
   * Obter agendamentos por ID do usuário
   */
  async getSchedulesByUserId(userId: string) {
    try {
      return prisma.schedule.findMany({
        where: {
          userId: userId
        },
        include: {
          user: true,
          doctor: {
            include: {
              role: true
            }
          },
          attendance: true
        },
        orderBy: {
          date: 'desc'
        }
      });
    } catch (error) {
      console.error(`Erro ao buscar agendamentos do usuário ${userId}:`, error);
      throw new Error('Não foi possível buscar os agendamentos do usuário');
    }
  }

  /**
   * Obter agendamentos por ID do médico
   */
  async getSchedulesByDoctorId(doctorId: string) {
    try {
      const schedules = await prisma.schedule.findMany({
        where: {
          doctorId
        },
        include: {
          user: true
        },
        orderBy: {
          date: 'asc'
        }
      });
      
      return schedules;
    } catch (error) {
      console.error(`Erro ao buscar agendamentos do médico ${doctorId}:`, error);
      throw new Error('Não foi possível buscar os agendamentos do médico');
    }
  }

  /**
   * Obter agendamento por ID
   */
  async getScheduleById(id: string) {
    try {
      const schedule = await prisma.schedule.findUnique({
        where: { id },
        include: {
          user: true,
          doctor: {
            include: {
              role: true
            }
          },
          attendance: true
        }
      });
      
      if (!schedule) {
        throw new Error('Agendamento não encontrado');
      }
      
      return schedule;
    } catch (error) {
      console.error(`Erro ao buscar agendamento ${id}:`, error);
      throw new Error('Não foi possível buscar o agendamento');
    }
  }

  /**
   * Criar um novo agendamento
   */
  async createSchedule(data: CreateScheduleDto) {
    try {
      console.log('Dados recebidos para criar agendamento:', JSON.stringify(data, null, 2));
      
      // Validar dados de entrada
      if (!data.userId) {
        throw new Error('ID do usuário é obrigatório');
      }
      
      if (!data.doctorId) {
        throw new Error('ID do médico é obrigatório');
      }
      
      if (!data.date) {
        throw new Error('Data da consulta é obrigatória');
      }
      
      if (!data.time) {
        throw new Error('Horário da consulta é obrigatório');
      }
      
      if (!data.type) {
        throw new Error('Tipo de consulta é obrigatório');
      }
      
      // Garantir que a data seja um objeto Date válido
      let dateObj: Date;
      try {
        dateObj = new Date(data.date);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Data inválida');
        }
      } catch (err) {
        throw new Error('Formato de data inválido. Use o formato ISO 8601.');
      }
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { 
          id: data.userId,
        },
        include: {
          role: true
        }
      });
      
      if (!user) {
        throw new Error(`Usuário não encontrado com o ID: ${data.userId}`);
      }

      if (!user.isActive) {
        throw new Error(`Usuário está inativo. ID: ${data.userId}`);
      }
      
      // Verificar se o médico existe
      const doctor = await prisma.user.findUnique({
        where: { 
          id: data.doctorId,
        },
        include: {
          role: true
        }
      });
      
      if (!doctor) {
        throw new Error(`Médico não encontrado com o ID: ${data.doctorId}`);
      }

      if (!doctor.isActive) {
        throw new Error(`Médico está inativo. ID: ${data.doctorId}`);
      }

      if (doctor.role.name !== 'MEDICO' && doctor.role.name !== 'Médico') {
        throw new Error(`O profissional selecionado não é um médico. Role: ${doctor.role.name}`);
      }
      
      // Criar o agendamento
      const schedule = await prisma.schedule.create({
        data: {
          userId: data.userId,
          doctorId: data.doctorId,
          date: dateObj,
          time: data.time,
          type: data.type,
          notes: data.notes,
          status: 'pending'
        },
        include: {
          user: true,
          doctor: true
        }
      });
      
      return schedule;
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      
      // Verificar se é um erro do Prisma
      if (error.code) {
        if (error.code === 'P2003') {
          throw new Error('Referência inválida: verifique os IDs de usuário e médico');
        }
        if (error.code === 'P2002') {
          throw new Error('Já existe um agendamento com essas informações');
        }
      }
      
      // Propagar erro original ou mensagem genérica
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Não foi possível criar o agendamento');
      }
    }
  }

  /**
   * Atualizar um agendamento
   */
  async updateSchedule(id: string, data: UpdateScheduleDto) {
    try {
      const schedule = await prisma.schedule.update({
        where: { id },
        data,
        include: {
          user: true,
          doctor: {
            include: {
              role: true
            }
          },
          attendance: true
        }
      });
      
      return schedule;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento ${id}:`, error);
      throw new Error('Não foi possível atualizar o agendamento');
    }
  }

  /**
   * Cancelar um agendamento
   */
  async cancelSchedule(id: string) {
    try {
      const schedule = await prisma.schedule.update({
        where: { id },
        data: {
          status: 'cancelled'
        },
        include: {
          user: true,
          doctor: {
            include: {
              role: true
            }
          },
          attendance: true
        }
      });
      
      return schedule;
    } catch (error) {
      console.error(`Erro ao cancelar agendamento ${id}:`, error);
      throw new Error('Não foi possível cancelar o agendamento');
    }
  }

  /**
   * Confirmar um agendamento
   */
  async confirmSchedule(id: string) {
    try {
      const schedule = await prisma.schedule.update({
        where: { id },
        data: {
          status: 'confirmed'
        },
        include: {
          user: true,
          doctor: {
            include: {
              role: true
            }
          },
          attendance: true
        }
      });
      
      return schedule;
    } catch (error) {
      console.error(`Erro ao confirmar agendamento ${id}:`, error);
      throw new Error('Não foi possível confirmar o agendamento');
    }
  }

  /**
   * Completar um agendamento
   */
  async completeSchedule(id: string) {
    try {
      const schedule = await prisma.schedule.update({
        where: { id },
        data: {
          status: 'completed'
        },
        include: {
          user: true,
          doctor: {
            include: {
              role: true
            }
          },
          attendance: true
        }
      });
      
      return schedule;
    } catch (error) {
      console.error(`Erro ao completar agendamento ${id}:`, error);
      throw new Error('Não foi possível completar o agendamento');
    }
  }
} 