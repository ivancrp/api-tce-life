import { Request, Response } from 'express';
import { AttendanceService } from '../services/AttendanceService';

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  async create(req: Request, res: Response) {
    const attendance = await this.attendanceService.create(req.body);
    return res.status(201).json(attendance);
  }

  async findByPatient(req: Request, res: Response) {
    const { patientId } = req.params;
    const attendances = await this.attendanceService.findByPatient(patientId);
    return res.json(attendances);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const attendance = await this.attendanceService.findById(id);
    return res.json(attendance);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const attendance = await this.attendanceService.update(id, req.body);
    return res.json(attendance);
  }
} 