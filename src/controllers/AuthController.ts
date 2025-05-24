import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Login com o Google
   */
  async loginWithGoogle(req: Request, res: Response) {
    try {
      console.log('Requisição de login com Google recebida');
      const { token } = req.body;
      
      if (!token) {
        console.error('Token não fornecido na requisição');
        return res.status(400).json({ error: 'Token não fornecido' });
      }
      
      console.log('Iniciando autenticação com Google...');
      const authResult = await this.authService.loginWithGoogle(token);
      console.log('Autenticação com Google bem-sucedida para:', authResult.user.email);
      
      return res.json(authResult);
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      
      // Tratamento mais específico baseado no tipo de erro
      if (error.message && error.message.includes('OAuth client')) {
        return res.status(401).json({
          error: 'Configuração inválida',
          message: 'Cliente OAuth inválido. Verifique as configurações no Google Cloud Console.',
          details: error.message
        });
      } else if (error.message && error.message.includes('Token inválido')) {
        return res.status(401).json({
          error: 'Token inválido',
          message: 'O token fornecido é inválido ou expirou.',
          details: error.message
        });
      }
      
      return res.status(401).json({ 
        error: 'Falha na autenticação',
        message: error.message || 'Erro desconhecido',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Login com credenciais (email/senha)
   */
  async loginWithCredentials(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      console.log('Requisição de login recebida para:', email);
      
      if (!email || !password) {
        console.log('Login falhou: email ou senha não fornecidos');
        return res.status(400).json({ 
          error: 'Campos obrigatórios',
          message: 'Email e senha são obrigatórios' 
        });
      }
      
      const authResult = await this.authService.loginWithCredentials({ email, password });
      console.log('Login bem-sucedido para:', email);
      
      return res.json(authResult);
    } catch (error: any) {
      console.error('Erro no login com credenciais:', error);
      
      // Tratamento específico para erros conhecidos
      if (error.message === 'Email ou senha inválidos') {
        return res.status(401).json({ 
          error: 'Credenciais inválidas',
          message: 'Email ou senha inválidos'
        });
      }
      
      // Para outros erros, retornar uma mensagem genérica
      return res.status(500).json({ 
        error: 'Erro interno',
        message: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.'
      });
    }
  }

  /**
   * Verificar token
   */
  async verifyToken(req: Request, res: Response) {
    try {
      // O token JWT já foi verificado pelo middleware de autenticação
      // Se chegamos aqui, significa que o token é válido
      return res.status(200).json({ valid: true });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).json({ 
        error: 'Token inválido',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 