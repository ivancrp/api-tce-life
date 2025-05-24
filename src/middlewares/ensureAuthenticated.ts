import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  role: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token JWT não encontrado', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'default');
    const { sub, role } = decoded as TokenPayload;

    request.user = {
      id: sub,
      role
    };

    return next();
  } catch {
    throw new AppError('Token JWT inválido', 401);
  }
} 