import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';

const authRoutes = Router();
const authController = new AuthController();

// Rota para login com Google
authRoutes.post('/google', authController.loginWithGoogle.bind(authController));

// Rota para login com credenciais (email/senha)
authRoutes.post('/login', authController.loginWithCredentials.bind(authController));

// Verificar se o token é válido
authRoutes.get('/verify', authMiddleware, authController.verifyToken.bind(authController));

export default authRoutes; 