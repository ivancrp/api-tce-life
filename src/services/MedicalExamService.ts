import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface CreateMedicalExamDTO {
  userId: string;
  attendanceId?: string;
  examType: string;
  requestDate: Date;
  laboratory?: string;
  observations?: string;
}

export class MedicalExamService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateMedicalExamDTO) {
    console.log('[MedicalExamService] Iniciando criação de exame com dados:', data);

    try {
      // Validações básicas
      if (!data.userId) {
        throw new AppError('ID do usuário é obrigatório');
      }
      if (!data.examType) {
        throw new AppError('Tipo do exame é obrigatório');
      }
      if (!data.requestDate) {
        throw new AppError('Data da solicitação é obrigatória');
      }

      console.log('[MedicalExamService] Validações passaram, criando exame no banco...');

      const exam = await this.prisma.medicalExam.create({
        data: {
          ...data,
          status: 'pending'
        }
      });

      console.log('[MedicalExamService] Exame criado com sucesso:', exam);
      return exam;
    } catch (error: any) {
      console.error('[MedicalExamService] Erro ao criar exame:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      if (error instanceof AppError) {
        throw error;
      }
      
      // Tratamento de erros específicos do Prisma
      if (error.code === 'P2002') {
        throw new AppError('Já existe um exame com estas informações');
      }
      if (error.code === 'P2003') {
        throw new AppError('Usuário ou atendimento não encontrado');
      }

      throw new AppError('Erro ao criar exame médico');
    }
  }

  async findByUserId(userId: string) {
    return this.prisma.medicalExam.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findPendingByUserId(userId: string) {
    return this.prisma.medicalExam.findMany({
      where: { 
        userId,
        requestDate: {
          gt: new Date()
        }
      },
      orderBy: { requestDate: 'asc' }
    });
  }

  async findByAttendanceId(attendanceId: string) {
    return this.prisma.medicalExam.findMany({
      where: { attendanceId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: Partial<CreateMedicalExamDTO>) {
    const exam = await this.prisma.medicalExam.findUnique({
      where: { id }
    });

    if (!exam) {
      throw new AppError('Exame não encontrado', 404);
    }

    return this.prisma.medicalExam.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    const exam = await this.prisma.medicalExam.findUnique({
      where: { id }
    });

    if (!exam) {
      throw new AppError('Exame não encontrado', 404);
    }

    await this.prisma.medicalExam.delete({
      where: { id }
    });
  }
} 