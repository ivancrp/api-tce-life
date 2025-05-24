export enum TipoUsuario {
  MEDICO = 'Médico',
  RECEPCIONISTA = 'Recepcionista',
  ADMINISTRADOR = 'Administrador',
  PACIENTE = 'Paciente'
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: TipoUsuario;
  senha: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: TipoUsuario;
} 