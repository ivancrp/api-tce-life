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
  vitalSigns?: VitalSigns;
  clinicalNotes?: {
    noteType: string;
    content: string;
  }[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
    startDate: Date;
    endDate?: Date;
  }[];
  medicalExams?: {
    examType: string;
    requestDate: Date;
    laboratory?: string;
  observations?: string;
  }[];
  medicalCertificates?: {
    type: string;
    startDate: Date;
    endDate?: Date;
    cid?: string;
    description: string;
    daysOff?: number;
  }[];
}

interface UpdateAttendanceDTO extends Partial<CreateAttendanceDTO> {
  status?: 'in_progress' | 'completed' | 'cancelled';
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  observations?: string;
}

export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

  async startAttendance(scheduleId: string) {
    // Verificar se o agendamento existe
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

    // Verificar se já existe um atendimento para este agendamento
    const existingAttendance = await this.prisma.attendance.findUnique({
      where: { scheduleId }
    });

    if (existingAttendance) {
      return this.findById(existingAttendance.id);
    }

    // Criar um novo atendimento
    const attendance = await this.prisma.attendance.create({
      data: {
        scheduleId: schedule.id,
        patientId: schedule.userId,
        doctorId: schedule.doctorId,
        status: 'in_progress'
      }
    });

    // Atualizar o status do agendamento
    await this.prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        status: 'in_progress'
      }
    });

    return this.findById(attendance.id);
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

    // Criar o atendimento
    const attendance = await this.prisma.attendance.create({
      data: {
        scheduleId: data.scheduleId,
        patientId: schedule.userId,
        doctorId: schedule.doctorId,
        status: 'in_progress'
      }
    });

    // Se houver sinais vitais, criar o registro
    if (data.vitalSigns) {
      await this.prisma.$queryRaw`
        INSERT INTO vital_signs (
          id,
          "userId",
          "attendanceId",
          temperature,
          "bloodPressure",
          "heartRate",
          "respiratoryRate",
          "oxygenSaturation",
          weight,
          height,
          "createdAt",
          "updatedAt"
        ) VALUES (
          ${Prisma.raw('uuid_generate_v4()')},
          ${schedule.userId},
          ${attendance.id},
          ${data.vitalSigns.temperature},
          ${data.vitalSigns.bloodPressure},
          ${data.vitalSigns.heartRate},
          ${data.vitalSigns.respiratoryRate},
          ${data.vitalSigns.oxygenSaturation},
          ${data.vitalSigns.weight},
          ${data.vitalSigns.height},
          NOW(),
          NOW()
        )
      `;
    }

    // Se houver anotações clínicas, criar os registros
    if (data.clinicalNotes) {
      for (const note of data.clinicalNotes) {
        await this.prisma.$queryRaw`
          INSERT INTO clinical_notes (
            id,
            "userId",
            "attendanceId",
            "noteType",
            content,
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${schedule.userId},
            ${attendance.id},
            ${note.noteType},
            ${note.content},
            NOW(),
            NOW()
          )
        `;
      }
    }

    // Se houver medicações, criar os registros
    if (data.medications) {
      for (const medication of data.medications) {
        await this.prisma.$queryRaw`
          INSERT INTO medications (
            id,
            "userId",
            "attendanceId",
            name,
            dosage,
            frequency,
            duration,
            instructions,
            "startDate",
            "endDate",
            active,
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${schedule.userId},
            ${attendance.id},
            ${medication.name},
            ${medication.dosage},
            ${medication.frequency},
            ${medication.duration},
            ${medication.instructions},
            ${medication.startDate},
            ${medication.endDate},
            true,
            NOW(),
            NOW()
          )
        `;
      }
    }

    // Se houver exames, criar os registros
    if (data.medicalExams) {
      for (const exam of data.medicalExams) {
        await this.prisma.$queryRaw`
          INSERT INTO medical_exams (
            id,
            "userId",
            "attendanceId",
            "examType",
            "requestDate",
            laboratory,
            observations,
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${schedule.userId},
            ${attendance.id},
            ${exam.examType},
            ${exam.requestDate},
            ${exam.laboratory},
            ${exam.observations},
            NOW(),
            NOW()
          )
        `;
      }
    }

    // Se houver atestados, criar os registros
    if (data.medicalCertificates) {
      for (const certificate of data.medicalCertificates) {
        await this.prisma.$queryRaw`
          INSERT INTO medical_certificates (
            id,
            "userId",
            "attendanceId",
            type,
            "startDate",
            "endDate",
            cid,
            description,
            "daysOff",
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${schedule.userId},
            ${attendance.id},
            ${certificate.type},
            ${certificate.startDate},
            ${certificate.endDate},
            ${certificate.cid},
            ${certificate.description},
            ${certificate.daysOff},
            NOW(),
            NOW()
          )
        `;
      }
    }

    return this.findById(attendance.id);
  }

  async findById(id: string) {
    console.log('Buscando atendimento por ID:', id);
    
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      select: {
        id: true,
        scheduleId: true,
        patientId: true,
        doctorId: true,
        status: true,
        symptoms: true,
        diagnosis: true,
        prescription: true,
        observations: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            name: true,
            nomeSocial: true,
            email: true,
            profilePicture: true,
            isActive: true,
            roleId: true,
            dateOfBirth: true,
            gender: true,
            naturalidade: true,
            nomeMae: true,
            nomePai: true,
            estadoCivil: true,
            escolaridade: true,
            telefone: true,
            celular: true,
            tipoSanguineo: true,
            raca: true,
            cpf: true,
            insurance: true,
            allergies: {
              where: {
                active: true
              },
              select: {
                allergen: true
              }
            },
            medications: {
              where: {
                active: true,
                attendanceId: null
              },
              select: {
                id: true,
                userId: true,
                attendanceId: true,
                name: true,
                dosage: true,
                frequency: true,
                duration: true,
                instructions: true,
                startDate: true,
                endDate: true,
                active: true,
                createdAt: true,
                updatedAt: true
              }
            }
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        schedule: {
          select: {
            id: true,
            userId: true,
            doctorId: true,
            date: true,
            time: true,
            status: true,
            type: true,
            notes: true
          }
        },
        clinicalNotes: {
          select: {
            id: true,
            noteType: true,
            content: true,
            createdAt: true
          }
        },
        medicalExams: {
          select: {
            id: true,
            examType: true,
            requestDate: true,
            resultDate: true,
            status: true,
            result: true,
            laboratory: true,
            observations: true,
            createdAt: true
          }
        },
        medicalCertificates: {
          select: {
            id: true,
            type: true,
            startDate: true,
            endDate: true,
            cid: true,
            description: true,
            daysOff: true,
            createdAt: true
          }
        },
        medications: {
      where: {
            active: true
          },
          select: {
            id: true,
            name: true,
            dosage: true,
            frequency: true,
            duration: true,
            instructions: true,
            startDate: true,
            endDate: true,
            active: true,
            createdAt: true
          }
        }
      }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Buscar os registros relacionados
    const [vitalSigns] = await Promise.all([
      this.prisma.vitalSigns.findFirst({
        where: { attendanceId: attendance.id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Formatar as alergias
    const formattedPatient = {
      ...attendance.patient,
      allergies: attendance.patient.allergies.map(a => a.allergen)
    };

    const result = {
      ...attendance,
      patient: formattedPatient,
      vitalSigns: vitalSigns || null
    };

    return result;
  }

  async findByScheduleId(scheduleId: string) {
    console.log('Buscando atendimento pelo scheduleId:', scheduleId);
    const attendance = await this.prisma.attendance.findUnique({
      where: { scheduleId },
      select: {
        id: true,
        scheduleId: true,
        patientId: true,
        doctorId: true,
        status: true,
        symptoms: true,
        diagnosis: true,
        prescription: true,
        observations: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            name: true,
            nomeSocial: true,
            email: true,
            profilePicture: true,
            isActive: true,
            roleId: true,
            dateOfBirth: true,
            gender: true,
            naturalidade: true,
            nomeMae: true,
            nomePai: true,
            estadoCivil: true,
            escolaridade: true,
            telefone: true,
            celular: true,
            tipoSanguineo: true,
            raca: true,
            cpf: true,
            insurance: true,
            allergies: {
              where: {
                active: true
              },
              select: {
                allergen: true
              }
            },
            medications: {
              where: {
                active: true,
                attendanceId: null
              },
              select: {
                id: true,
                userId: true,
                attendanceId: true,
                name: true,
                dosage: true,
                frequency: true,
                duration: true,
                instructions: true,
                startDate: true,
                endDate: true,
                active: true,
                createdAt: true,
                updatedAt: true
              }
            }
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        schedule: {
          select: {
            id: true,
            userId: true,
            doctorId: true,
            date: true,
            time: true,
            status: true,
            type: true,
            notes: true
          }
        },
        clinicalNotes: {
          select: {
            id: true,
            noteType: true,
            content: true,
            createdAt: true
          }
        },
        medicalExams: {
          select: {
            id: true,
            examType: true,
            requestDate: true,
            resultDate: true,
            status: true,
            result: true,
            laboratory: true,
            observations: true,
            createdAt: true
          }
        },
        medicalCertificates: {
          select: {
            id: true,
            type: true,
            startDate: true,
            endDate: true,
            cid: true,
            description: true,
            daysOff: true,
            createdAt: true
          }
        },
        medications: {
          where: {
            active: true
          },
          select: {
            id: true,
            name: true,
            dosage: true,
            frequency: true,
            duration: true,
            instructions: true,
            startDate: true,
            endDate: true,
            active: true,
            createdAt: true
          }
        }
      }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Buscar os registros relacionados
    const [vitalSigns] = await Promise.all([
      this.prisma.vitalSigns.findFirst({
        where: { attendanceId: attendance.id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Formatar as alergias
    const formattedPatient = {
      ...attendance.patient,
      allergies: attendance.patient.allergies.map(a => a.allergen)
    };

    const result = {
      ...attendance,
      patient: formattedPatient,
      vitalSigns: vitalSigns || null
    };

    return result;
  }

  async update(id: string, data: UpdateAttendanceDTO) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Atualizar o atendimento
    const updatedAttendance = await this.prisma.attendance.update({
      where: { id },
      data: {
        status: data.status,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        observations: data.observations
      }
    });

    // Se houver sinais vitais, atualizar ou criar novo registro
    if (data.vitalSigns) {
      // Buscar o último registro de sinais vitais deste atendimento
      const lastVitalSigns = await this.prisma.vitalSigns.findFirst({
        where: { attendanceId: attendance.id },
        orderBy: { createdAt: 'desc' }
      });

      if (lastVitalSigns) {
        // Atualizar o registro existente
        await this.prisma.vitalSigns.update({
          where: { id: lastVitalSigns.id },
          data: {
            temperature: data.vitalSigns.temperature,
            bloodPressure: data.vitalSigns.bloodPressure,
            heartRate: data.vitalSigns.heartRate,
            respiratoryRate: data.vitalSigns.respiratoryRate,
            oxygenSaturation: data.vitalSigns.oxygenSaturation,
            weight: data.vitalSigns.weight,
            height: data.vitalSigns.height
          }
        });
      } else {
        // Criar novo registro
        await this.prisma.vitalSigns.create({
          data: {
            userId: attendance.patientId,
            attendanceId: attendance.id,
            temperature: data.vitalSigns.temperature,
            bloodPressure: data.vitalSigns.bloodPressure,
            heartRate: data.vitalSigns.heartRate,
            respiratoryRate: data.vitalSigns.respiratoryRate,
            oxygenSaturation: data.vitalSigns.oxygenSaturation,
            weight: data.vitalSigns.weight,
            height: data.vitalSigns.height
          }
        });
      }
    }

    // Se houver anotações clínicas, criar novos registros
    if (data.clinicalNotes) {
      for (const note of data.clinicalNotes) {
        await this.prisma.clinicalNote.create({
          data: {
            userId: attendance.patientId,
            attendanceId: attendance.id,
            noteType: note.noteType,
            content: note.content
          }
        });
      }
    }

    return this.findById(id);
  }

  async complete(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Atualizar o status do atendimento
    await this.prisma.attendance.update({
        where: { id },
      data: {
        status: 'completed'
      }
    });

    // Atualizar o status do agendamento
    await this.prisma.schedule.update({
        where: { id: attendance.scheduleId },
      data: {
        status: 'completed'
      }
    });

    return this.findById(id);
  }

  async cancel(id: string, reason: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Atualizar o status do atendimento
    await this.prisma.attendance.update({
      where: { id },
      data: {
        status: 'cancelled',
        observations: reason // Salvando o motivo do cancelamento nas observações
      }
    });

    // Atualizar o status do agendamento
    await this.prisma.schedule.update({
      where: { id: attendance.scheduleId },
      data: {
        status: 'cancelled'
      }
    });

    return this.findById(id);
  }
} 