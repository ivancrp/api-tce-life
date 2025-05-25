import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { uploadFile } from '../services/uploadService';

export class MedicalExamController {
  async create(req: Request, res: Response) {
    try {
      const { attendanceId, examType, laboratory, observations } = req.body;

      // Buscar o atendimento para obter o userId
      const attendance = await prisma.attendance.findUnique({
        where: { id: attendanceId },
        select: { patientId: true }
      });

      if (!attendance) {
        return res.status(404).json({ error: 'Atendimento não encontrado' });
      }

      const exam = await prisma.medicalExam.create({
        data: {
          attendanceId,
          examType,
          laboratory,
          observations,
          requestDate: new Date(),
          status: 'pending',
          userId: attendance.patientId // Usando o patientId como userId
        }
      });

      return res.status(201).json(exam);
    } catch (error) {
      console.error('Erro ao criar exame:', error);
      return res.status(500).json({ error: 'Erro ao criar exame' });
    }
  }

  async uploadFiles(req: Request, res: Response) {
    try {
      const { examId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Upload dos arquivos localmente
      const uploadPromises = files.map(file => uploadFile(file));
      const uploadedPaths = await Promise.all(uploadPromises);

      const exam = await prisma.medicalExam.update({
        where: { id: examId },
        data: {
          status: 'completed',
          resultDate: new Date(),
          result: uploadedPaths[0], // Caminho principal do resultado
          attachments: uploadedPaths // Todos os caminhos dos anexos
        }
      });

      return res.json(exam);
    } catch (error) {
      console.error('Erro ao fazer upload dos arquivos:', error);
      return res.status(500).json({ error: 'Erro ao fazer upload dos arquivos' });
    }
  }

  async getByAttendanceId(req: Request, res: Response) {
    try {
      const { attendanceId } = req.params;

      const exams = await prisma.medicalExam.findMany({
        where: { attendanceId },
        orderBy: { requestDate: 'desc' }
      });

      return res.json(exams);
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
      return res.status(500).json({ error: 'Erro ao buscar exames' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { examId } = req.params;
      const { status, observations } = req.body;

      const exam = await prisma.medicalExam.update({
        where: { id: examId },
        data: { status, observations }
      });

      return res.json(exam);
    } catch (error) {
      console.error('Erro ao atualizar exame:', error);
      return res.status(500).json({ error: 'Erro ao atualizar exame' });
    }
  }

  async getByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const exams = await prisma.medicalExam.findMany({
        where: { userId },
        orderBy: { requestDate: 'desc' },
        include: {
          attendance: {
            select: {
              doctor: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      return res.json(exams);
    } catch (error) {
      console.error('Erro ao buscar exames do paciente:', error);
      return res.status(500).json({ error: 'Erro ao buscar exames do paciente' });
    }
  }
} 