import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface CreateVitalSignsDTO {
  userId: string;
  attendanceId?: string;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

interface UpdateVitalSignsDTO extends Partial<CreateVitalSignsDTO> {}

export class VitalSignsService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateVitalSignsDTO) {
    return this.prisma.vitalSigns.create({
      data
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.vitalSigns.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByAttendanceId(attendanceId: string) {
    return this.prisma.vitalSigns.findMany({
      where: { attendanceId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findLatestByUserId(userId: string) {
    const vitalSigns = await this.prisma.vitalSigns.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!vitalSigns) {
      throw new AppError('Nenhum registro de sinais vitais encontrado', 404);
    }

    return vitalSigns;
  }

  async update(id: string, data: UpdateVitalSignsDTO) {
    const vitalSigns = await this.prisma.vitalSigns.findUnique({
      where: { id }
    });

    if (!vitalSigns) {
      throw new AppError('Registro de sinais vitais não encontrado', 404);
    }

    return this.prisma.vitalSigns.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    const vitalSigns = await this.prisma.vitalSigns.findUnique({
      where: { id }
    });

    if (!vitalSigns) {
      throw new AppError('Registro de sinais vitais não encontrado', 404);
    }

    return this.prisma.vitalSigns.delete({
      where: { id }
    });
  }
} 