import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface CreateAllergyDTO {
  userId: string;
  allergen: string;
  severity: string;
  reactions: string;
  diagnosed?: Date;
  notes?: string;
}

export class AllergyService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateAllergyDTO) {
    return this.prisma.allergy.create({
      data: {
        ...data,
        active: true
      }
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.allergy.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findActiveByUserId(userId: string) {
    return this.prisma.allergy.findMany({
      where: { 
        userId,
        active: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: Partial<CreateAllergyDTO>) {
    const allergy = await this.prisma.allergy.findUnique({
      where: { id }
    });

    if (!allergy) {
      throw new AppError('Alergia não encontrada', 404);
    }

    return this.prisma.allergy.update({
      where: { id },
      data
    });
  }

  async deactivate(id: string) {
    const allergy = await this.prisma.allergy.findUnique({
      where: { id }
    });

    if (!allergy) {
      throw new AppError('Alergia não encontrada', 404);
    }

    return this.prisma.allergy.update({
      where: { id },
      data: {
        active: false
      }
    });
  }

  async delete(id: string) {
    const allergy = await this.prisma.allergy.findUnique({
      where: { id }
    });

    if (!allergy) {
      throw new AppError('Alergia não encontrada', 404);
    }

    await this.prisma.allergy.delete({
      where: { id }
    });
  }
} 