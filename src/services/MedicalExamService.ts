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
    return this.prisma.medicalExam.create({
      data
    });
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