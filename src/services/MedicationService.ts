import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface CreateMedicationDTO {
  userId: string;
  attendanceId?: string;
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date;
}

export class MedicationService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateMedicationDTO) {
    return this.prisma.medication.create({
      data: {
        ...data,
        active: true
      }
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findActiveByUserId(userId: string) {
    return this.prisma.medication.findMany({
      where: { 
        userId,
        active: true,
        endDate: {
          gt: new Date()
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByAttendanceId(attendanceId: string) {
    return this.prisma.medication.findMany({
      where: { attendanceId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: Partial<CreateMedicationDTO>) {
    const medication = await this.prisma.medication.findUnique({
      where: { id }
    });

    if (!medication) {
      throw new AppError('Medicação não encontrada', 404);
    }

    return this.prisma.medication.update({
      where: { id },
      data
    });
  }

  async deactivate(id: string) {
    const medication = await this.prisma.medication.findUnique({
      where: { id }
    });

    if (!medication) {
      throw new AppError('Medicação não encontrada', 404);
    }

    return this.prisma.medication.update({
      where: { id },
      data: {
        active: false,
        endDate: new Date()
      }
    });
  }

  async delete(id: string) {
    const medication = await this.prisma.medication.findUnique({
      where: { id }
    });

    if (!medication) {
      throw new AppError('Medicação não encontrada', 404);
    }

    await this.prisma.medication.delete({
      where: { id }
    });
  }
} 