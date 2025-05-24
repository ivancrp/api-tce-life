import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import 'dotenv/config';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
});

// Verificar se as credenciais do Google estão configuradas
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('ATENÇÃO: Credenciais do Google OAuth não configuradas corretamente no arquivo .env');
  console.error('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'configurado' : 'ausente');
  console.error('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'configurado' : 'ausente');
}

const JWT_SECRET = process.env.JWT_SECRET || 'tce-life-super-secret-jwt-key';

interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Verificar token do Google
   */
  async verifyGoogleToken(token: string) {
    try {
      console.log('Verificando token do Google...');
      
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('Credenciais do Google OAuth não configuradas no servidor');
      }
      
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Token inválido: payload não encontrado');
      }
      
      if (!payload.email) {
        throw new Error('Token inválido: email não encontrado');
      }
      
      if (!payload.email_verified) {
        throw new Error('Email não verificado pelo Google');
      }
      
      console.log('Token do Google verificado com sucesso:', {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      });
      
      return payload;
    } catch (error: any) {
      console.error('Erro ao verificar token do Google:', {
        message: error.message,
        code: error.code,
        status: error.status,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
      
      // Tratamento específico para erros conhecidos
      if (error.message && error.message.includes('invalid_client')) {
        throw new Error('Cliente OAuth inválido. Verifique as configurações no Google Cloud Console.');
      }
      
      if (error.message && error.message.includes('invalid_token')) {
        throw new Error('Token inválido ou expirado. Faça login novamente.');
      }
      
      throw new Error('Falha na autenticação com Google: ' + error.message);
    }
  }

  /**
   * Login com Google (para usuários do sistema)
   */
  async loginWithGoogle(googleToken: string) {
    try {
      const googleUserInfo = await this.verifyGoogleToken(googleToken);
      
      if (!googleUserInfo || !googleUserInfo.email) {
        throw new Error('Não foi possível obter informações do usuário');
      }
      
      // Buscar usuário pelo email
      let user = await prisma.user.findUnique({
        where: { email: googleUserInfo.email },
        include: { role: true }
      });
      
      if (user) {
        // Verificar se é necessário atualizar alguma informação do usuário
        const needsUpdate = 
          (googleUserInfo.name && user.name !== googleUserInfo.name) || 
          (googleUserInfo.picture && user.profilePicture !== googleUserInfo.picture) ||
          (googleUserInfo.sub && user.googleId !== googleUserInfo.sub);
        
        if (needsUpdate) {
          console.log('Atualizando informações do usuário:', user.email);
          // Atualizar informações do usuário
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              name: googleUserInfo.name || user.name,
              profilePicture: googleUserInfo.picture || user.profilePicture,
              googleId: googleUserInfo.sub || user.googleId || ''
            },
            include: { role: true }
          });
        }
      } else {
        console.log('Criando novo usuário a partir da autenticação Google:', googleUserInfo.email);
        // Se não existir, criar um novo usuário
        // Buscar role de paciente (padrão para novos usuários)
        const pacienteRole = await prisma.role.findUnique({
          where: { name: 'PACIENTE' }
        });
        
        if (!pacienteRole) {
          throw new Error('Role PACIENTE não encontrada');
        }
        
        // Criar usuário
        user = await prisma.user.create({
          data: {
            name: googleUserInfo.name || 'Usuário Google',
            email: googleUserInfo.email,
            profilePicture: googleUserInfo.picture || null,
            googleId: googleUserInfo.sub || '',
            roleId: pacienteRole.id,
            isActive: true
          },
          include: { role: true }
        });

        console.log('Novo usuário criado via Google Auth:', {
          id: user.id,
          email: user.email,
          role: user.role.name
        });
      }
      
      // Verificar se o usuário foi encontrado/criado corretamente
      if (!user || !user.role) {
        throw new Error('Não foi possível criar ou encontrar o usuário');
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role.name,
          type: 'user'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          role: user.role.name
        }
      };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error; // Propagar o erro original para o controlador
    }
  }

  /**
   * Login com email e senha (usuários e pacientes)
   */
  async loginWithCredentials(credentials: LoginCredentials) {
    try {
      const { email, password } = credentials;
      
      console.log('Tentativa de login com email:', email);
      
      // Tentar encontrar um usuário com esse email
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });
      
      console.log('Usuário encontrado:', user ? 'sim' : 'não');
      
      // Se encontrar usuário e a senha estiver correta
      if (user && user.password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Senha do usuário válida:', isPasswordValid);
        
        if (isPasswordValid) {
          // Gerar token JWT
          const token = jwt.sign(
            { 
              id: user.id, 
              email: user.email,
              role: user.role.name,
              type: 'user'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          console.log('Login bem-sucedido para usuário:', user.email);
          
          return {
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              profilePicture: user.profilePicture,
              role: user.role.name
            }
          };
        }
      }
      
      // Se não encontrou usuário, tentar encontrar um paciente
      const patient = await prisma.patient.findFirst({
        where: { email },
        include: { role: true }
      });
      
      console.log('Paciente encontrado:', patient ? 'sim' : 'não');
      
      // Se encontrar paciente e a senha estiver correta
      if (patient && patient.password) {
        const isPasswordValid = await bcrypt.compare(password, patient.password);
        console.log('Senha do paciente válida:', isPasswordValid);
        
        if (isPasswordValid && patient.role) {
          // Gerar token JWT
          const token = jwt.sign(
            { 
              id: patient.id, 
              email: patient.email,
              role: patient.role.name,
              type: 'patient'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          console.log('Login bem-sucedido para paciente:', patient.email);
          
          return {
            token,
            user: {
              id: patient.id,
              name: patient.name,
              email: patient.email,
              role: patient.role.name,
              dateOfBirth: patient.dateOfBirth,
              gender: patient.gender
            }
          };
        }
      }
      
      console.log('Login falhou: email ou senha inválidos');
      throw new Error('Email ou senha inválidos');
    } catch (error) {
      console.error('Erro no login com credenciais:', error);
      // Propagar o erro original para manter a mensagem específica
      throw error;
    }
  }
} 