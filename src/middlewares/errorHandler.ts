import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return response.status(409).json({
        status: 'error',
        message: 'Já existe um registro com este valor único'
      });
    }

    if (error.code === 'P2025') {
      return response.status(404).json({
        status: 'error',
        message: 'Registro não encontrado'
      });
    }

    if (error.code === 'P2003') {
      return response.status(400).json({
        status: 'error',
        message: 'Violação de chave estrangeira'
      });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return response.status(400).json({
      status: 'error',
      message: 'Erro de validação dos dados'
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  });
} 