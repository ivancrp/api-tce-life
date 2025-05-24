import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tipos de usuário permitidos
export type TipoUsuario = 'MEDICO' | 'SECRETARIA' | 'ADMIN' | 'PACIENTE';

// Interface para o payload do token
interface TokenPayload {
    id: string;
    role: TipoUsuario;
    email: string;
}

// Middleware para verificar se o usuário está autenticado
export const verificarAutenticacao = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log('Token não fornecido');
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const [, token] = authHeader.split(' ');

        if (!token) {
            console.log('Token inválido ou mal formatado');
            return res.status(401).json({ error: 'Token inválido ou mal formatado' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as TokenPayload;
            req.usuario = decoded;
            console.log('Token verificado com sucesso:', decoded);
            return next();
        } catch (err) {
            console.log('Erro ao verificar token:', err);
            return res.status(401).json({ error: 'Token inválido' });
        }
    } catch (err) {
        console.log('Erro no middleware de autenticação:', err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

// Middleware para verificar se o usuário tem a permissão necessária
export function verificarPermissao(rolesPermitidas: TipoUsuario[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ mensagem: 'Token não fornecido' });
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as TokenPayload;
            
            if (!rolesPermitidas.includes(decoded.role)) {
                return res.status(403).json({ 
                    mensagem: 'Acesso negado', 
                    roleAtual: decoded.role,
                    rolesPermitidas: rolesPermitidas
                });
            }
            
            next();
        } catch (err) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }
    };
} 