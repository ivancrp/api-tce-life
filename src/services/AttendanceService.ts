import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface VitalSigns {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

interface CreateAttendanceDTO {
  scheduleId: string;
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  observations?: string;
  vitalSigns: VitalSigns;
}

interface UpdateAttendanceDTO {
  scheduleId?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  observations?: string;
  vitalSigns?: VitalSigns;
  status?: 'in_progress' | 'completed';
}

export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

  async startAttendance(scheduleId: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        user: true,
        doctor: true
      }
    });

    if (!schedule) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    // Verifica se já existe um atendimento para este agendamento
    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        scheduleId: scheduleId
      } as any
    });

    if (existingAttendance) {
      throw new AppError('Já existe um atendimento para este agendamento', 400);
    }

    // Atualiza o status do agendamento para 'in_progress'
    await this.prisma.schedule.update({
      where: { id: scheduleId },
      data: { status: 'in_progress' }
    });

    // Cria um novo atendimento
    return this.prisma.attendance.create({
      data: {
        scheduleId: scheduleId,
        patientId: schedule.userId,
        doctorId: schedule.doctorId,
        symptoms: '',
        vitalSigns: {} as any,
        status: 'in_progress'
      } as any
    });
  }

  async create(data: CreateAttendanceDTO) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: data.scheduleId },
      include: {
        user: true,
        doctor: true
      }
    });

    if (!schedule) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    // Atualiza o status do agendamento para 'in_progress'
    await this.prisma.schedule.update({
      where: { id: data.scheduleId },
      data: { status: 'in_progress' }
    });

    return this.prisma.attendance.create({
      data: {
        scheduleId: data.scheduleId,
        patientId: schedule.userId,
        doctorId: schedule.doctorId,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        observations: data.observations,
        vitalSigns: data.vitalSigns as any,
        status: 'in_progress'
      } as any
    });
  }

  async findByScheduleId(scheduleId: string) {
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        scheduleId: scheduleId
      } as any
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    return attendance;
  }

  async findById(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    return attendance;
  }

  async update(id: string, data: UpdateAttendanceDTO) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        schedule: true
      }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    console.log('Atualizando atendimento:', {
      id,
      currentData: attendance,
      newData: data
    });

    // Mantém os campos existentes se não forem fornecidos na atualização
    const updatedData = {
      symptoms: data.symptoms ?? attendance.symptoms,
      diagnosis: data.diagnosis ?? attendance.diagnosis,
      prescription: data.prescription ?? attendance.prescription,
      observations: data.observations ?? attendance.observations,
      vitalSigns: data.vitalSigns ?? attendance.vitalSigns,
      status: data.status ?? attendance.status
    };

    console.log('Dados para atualização:', updatedData);

    try {
      const updatedAttendance = await this.prisma.attendance.update({
        where: { id },
        data: updatedData as any,
        include: {
          patient: true,
          doctor: true,
          schedule: true
        }
      });

      console.log('Atendimento atualizado com sucesso:', updatedAttendance);
      return updatedAttendance;
    } catch (error) {
      console.error('Erro ao atualizar atendimento:', error);
      throw new AppError('Erro ao atualizar atendimento', 500);
    }
  }

  async complete(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Atualiza o status do atendimento e do agendamento
    const [updatedAttendance] = await this.prisma.$transaction([
      this.prisma.attendance.update({
        where: { id },
        data: { status: 'completed' } as any
      }),
      this.prisma.schedule.update({
        where: { id: attendance.scheduleId },
        data: { status: 'completed' }
      })
    ]);

    return updatedAttendance;
  }

  async findByPatientId(patientId: string) {
    return this.prisma.attendance.findMany({
      where: {
        patientId: patientId
      } as any,
      orderBy: { createdAt: 'desc' }
    });
  }
} 