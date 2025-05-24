import { TipoUsuario } from '../middlewares/authMiddleware';

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                id: string;
                role: TipoUsuario;
                email: string;
            };
        }
    }
} 