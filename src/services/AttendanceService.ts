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
  status?: 'in_progress' | 'completed';
}

export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

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
          user_id,
          attendance_id,
          temperature,
          blood_pressure,
          heart_rate,
          respiratory_rate,
          oxygen_saturation,
          weight,
          height,
          created_at,
          updated_at
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
            user_id,
            attendance_id,
            note_type,
            content,
            created_at,
            updated_at
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
            user_id,
            attendance_id,
            name,
            dosage,
            frequency,
            duration,
            instructions,
            start_date,
            end_date,
            active,
            created_at,
            updated_at
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
            user_id,
            attendance_id,
            exam_type,
            request_date,
            laboratory,
            observations,
            created_at,
            updated_at
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
            user_id,
            attendance_id,
            type,
            start_date,
            end_date,
            cid,
            description,
            days_off,
            created_at,
            updated_at
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

    // Buscar os registros relacionados
    const [
      vitalSigns,
      clinicalNotes,
      medications,
      medicalExams,
      medicalCertificates
    ] = await Promise.all([
      this.prisma.$queryRaw`
        SELECT * FROM vital_signs
        WHERE attendance_id = ${id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM clinical_notes
        WHERE attendance_id = ${id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM medications
        WHERE attendance_id = ${id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM medical_exams
        WHERE attendance_id = ${id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM medical_certificates
        WHERE attendance_id = ${id}
        ORDER BY created_at DESC
      `
    ]);

    return {
      ...attendance,
      vitalSigns,
      clinicalNotes,
      medications,
      medicalExams,
      medicalCertificates
    };
  }

  async findByScheduleId(scheduleId: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { scheduleId },
      include: {
        patient: true,
        doctor: true,
        schedule: true
      }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Buscar os registros relacionados
    const [
      vitalSigns,
      clinicalNotes,
      medications,
      medicalExams,
      medicalCertificates
    ] = await Promise.all([
      this.prisma.$queryRaw`
        SELECT * FROM vital_signs
        WHERE attendance_id = ${attendance.id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM clinical_notes
        WHERE attendance_id = ${attendance.id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM medications
        WHERE attendance_id = ${attendance.id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM medical_exams
        WHERE attendance_id = ${attendance.id}
        ORDER BY created_at DESC
      `,
      this.prisma.$queryRaw`
        SELECT * FROM medical_certificates
        WHERE attendance_id = ${attendance.id}
        ORDER BY created_at DESC
      `
    ]);

    return {
      ...attendance,
      vitalSigns,
      clinicalNotes,
      medications,
      medicalExams,
      medicalCertificates
    };
  }

  async update(id: string, data: UpdateAttendanceDTO) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id }
    });

    if (!attendance) {
      throw new AppError('Atendimento não encontrado', 404);
    }

    // Atualizar o atendimento
    await this.prisma.attendance.update({
      where: { id },
      data: {
        status: data.status
      }
    });

    // Se houver sinais vitais, criar novo registro
    if (data.vitalSigns) {
      await this.prisma.$queryRaw`
        INSERT INTO vital_signs (
          id,
          user_id,
          attendance_id,
          temperature,
          blood_pressure,
          heart_rate,
          respiratory_rate,
          oxygen_saturation,
          weight,
          height,
          created_at,
          updated_at
        ) VALUES (
          ${Prisma.raw('uuid_generate_v4()')},
          ${attendance.patientId},
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

    // Se houver anotações clínicas, criar novos registros
    if (data.clinicalNotes) {
      for (const note of data.clinicalNotes) {
        await this.prisma.$queryRaw`
          INSERT INTO clinical_notes (
            id,
            user_id,
            attendance_id,
            note_type,
            content,
            created_at,
            updated_at
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${attendance.patientId},
            ${attendance.id},
            ${note.noteType},
            ${note.content},
            NOW(),
            NOW()
          )
        `;
      }
    }

    // Se houver medicações, criar novos registros
    if (data.medications) {
      for (const medication of data.medications) {
        await this.prisma.$queryRaw`
          INSERT INTO medications (
            id,
            user_id,
            attendance_id,
            name,
            dosage,
            frequency,
            duration,
            instructions,
            start_date,
            end_date,
            active,
            created_at,
            updated_at
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${attendance.patientId},
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

    // Se houver exames, criar novos registros
    if (data.medicalExams) {
      for (const exam of data.medicalExams) {
        await this.prisma.$queryRaw`
          INSERT INTO medical_exams (
            id,
            user_id,
            attendance_id,
            exam_type,
            request_date,
            laboratory,
            observations,
            created_at,
            updated_at
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${attendance.patientId},
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

    // Se houver atestados, criar novos registros
    if (data.medicalCertificates) {
      for (const certificate of data.medicalCertificates) {
        await this.prisma.$queryRaw`
          INSERT INTO medical_certificates (
            id,
            user_id,
            attendance_id,
            type,
            start_date,
            end_date,
            cid,
            description,
            days_off,
            created_at,
            updated_at
          ) VALUES (
            ${Prisma.raw('uuid_generate_v4()')},
            ${attendance.patientId},
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
} 