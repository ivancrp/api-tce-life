import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface CreateMedicalCertificateDTO {
  userId: string;
  attendanceId?: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  cid?: string;
  description: string;
  daysOff?: number;
}

interface UpdateMedicalCertificateDTO extends Partial<CreateMedicalCertificateDTO> {}

export class MedicalCertificateService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateMedicalCertificateDTO) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return this.prisma.medicalCertificate.create({
      data: {
        userId: data.userId,
        attendanceId: data.attendanceId,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        cid: data.cid,
        description: data.description,
        daysOff: data.daysOff
      }
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.medicalCertificate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        attendance: true
      }
    });
  }

  async findByAttendanceId(attendanceId: string) {
    return this.prisma.medicalCertificate.findMany({
      where: { attendanceId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        attendance: true
      }
    });
  }

  async findById(id: string) {
    const certificate = await this.prisma.medicalCertificate.findUnique({
      where: { id },
      include: {
        user: true,
        attendance: true
      }
    });

    if (!certificate) {
      throw new AppError('Atestado médico não encontrado', 404);
    }

    return certificate;
  }

  async update(id: string, data: UpdateMedicalCertificateDTO) {
    const certificate = await this.prisma.medicalCertificate.findUnique({
      where: { id }
    });

    if (!certificate) {
      throw new AppError('Atestado médico não encontrado', 404);
    }

    return this.prisma.medicalCertificate.update({
      where: { id },
      data,
      include: {
        user: true,
        attendance: true
      }
    });
  }

  async delete(id: string) {
    const certificate = await this.prisma.medicalCertificate.findUnique({
      where: { id }
    });

    if (!certificate) {
      throw new AppError('Atestado médico não encontrado', 404);
    }

    return this.prisma.medicalCertificate.delete({
      where: { id }
    });
  }
} 