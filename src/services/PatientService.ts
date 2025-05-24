import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RoleService } from './RoleService';

const prisma = new PrismaClient();
const roleService = new RoleService();

interface CreatePatientDto {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: string;
  insurance?: string;
}

interface UpdatePatientDto {
  name?: string;
  email?: string;
  password?: string;
  dateOfBirth?: Date;
  gender?: string;
  insurance?: string;
}

export class PatientService {
  /**
   * Obter todos os pacientes
   */
  async getAllPatients() {
    try {
      const patients = await prisma.patient.findMany({
        include: {
          role: true
        }
      });
      
      return patients;
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      throw new Error('Não foi possível buscar os pacientes');
    }
  }

  /**
   * Buscar paciente por ID
   */
  async getPatientById(id: string) {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          role: true
        }
      });
      
      if (!patient) {
        throw new Error('Paciente não encontrado');
      }
      
      return patient;
    } catch (error) {
      console.error(`Erro ao buscar paciente ${id}:`, error);
      throw new Error('Não foi possível buscar o paciente');
    }
  }

  /**
   * Buscar paciente por e-mail
   */
  async getPatientByEmail(email: string) {
    try {
      const patient = await prisma.patient.findUnique({
        where: { email },
        include: {
          role: true
        }
      });
      
      return patient;
    } catch (error) {
      console.error(`Erro ao buscar paciente com e-mail ${email}:`, error);
      throw new Error('Não foi possível buscar o paciente');
    }
  }

  /**
   * Criar um novo paciente
   */
  async createPatient(data: CreatePatientDto) {
    try {
      // Verificar se já existe um paciente com o mesmo e-mail
      const existingPatient = await this.getPatientByEmail(data.email);
      if (existingPatient) {
        throw new Error('Já existe um paciente com este e-mail');
      }
      
      // Obter a role de "Paciente"
      const role = await roleService.getRoleByName('Paciente');
      
      // Criar hash da senha
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Criar o paciente
      const patient = await prisma.patient.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          insurance: data.insurance,
          roleId: role.id
        },
        include: {
          role: true
        }
      });
      
      return patient;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      throw new Error('Não foi possível criar o paciente');
    }
  }

  /**
   * Atualizar um paciente
   */
  async updatePatient(id: string, data: UpdatePatientDto) {
    try {
      // Se o e-mail for atualizado, verificar se já existe outro paciente com o mesmo e-mail
      if (data.email) {
        const existingPatient = await this.getPatientByEmail(data.email);
        if (existingPatient && existingPatient.id !== id) {
          throw new Error('Já existe um paciente com este e-mail');
        }
      }
      
      // Se a senha for atualizada, criar hash
      let hashedPassword;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }
      
      // Atualizar o paciente
      const patient = await prisma.patient.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword || undefined,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          insurance: data.insurance
        },
        include: {
          role: true
        }
      });
      
      return patient;
    } catch (error) {
      console.error(`Erro ao atualizar paciente ${id}:`, error);
      throw new Error('Não foi possível atualizar o paciente');
    }
  }

  /**
   * Verificar credenciais do paciente
   */
  async verifyPatientCredentials(email: string, password: string) {
    try {
      const patient = await this.getPatientByEmail(email);
      
      if (!patient || !patient.password) {
        return null;
      }
      
      const passwordValid = await bcrypt.compare(password, patient.password);
      
      if (!passwordValid) {
        return null;
      }
      
      return patient;
    } catch (error) {
      console.error('Erro ao verificar credenciais do paciente:', error);
      throw new Error('Não foi possível verificar as credenciais');
    }
  }
} 