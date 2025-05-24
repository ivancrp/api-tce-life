import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface CreateClinicalNoteDTO {
  userId: string;
  attendanceId?: string;
  noteType: string;
  content: string;
}

export class ClinicalNoteService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateClinicalNoteDTO) {
    return this.prisma.clinicalNote.create({
      data
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.clinicalNote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByAttendanceId(attendanceId: string) {
    return this.prisma.clinicalNote.findMany({
      where: { attendanceId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByType(userId: string, noteType: string) {
    return this.prisma.clinicalNote.findMany({
      where: { userId, noteType },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: Partial<CreateClinicalNoteDTO>) {
    const note = await this.prisma.clinicalNote.findUnique({
      where: { id }
    });

    if (!note) {
      throw new AppError('Anotação clínica não encontrada', 404);
    }

    return this.prisma.clinicalNote.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    const note = await this.prisma.clinicalNote.findUnique({
      where: { id }
    });

    if (!note) {
      throw new AppError('Anotação clínica não encontrada', 404);
    }

    await this.prisma.clinicalNote.delete({
      where: { id }
    });
  }
} 