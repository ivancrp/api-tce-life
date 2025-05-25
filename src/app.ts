import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';
import { specialtyRouter } from './routes/specialty.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';
import path from 'path';

const app = express();

// Configuração CORS mais permissiva para autenticação
const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));

// Middleware para permitir solicitações pré-voo (preflight) para autenticação
app.options('*', cors(corsOptions));

// Adicionar headers necessários para o Google Sign-In
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(express.json());

// Configuração para servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas de autenticação (montadas diretamente em /auth)
app.use('/auth', authRoutes);

// Outras rotas da API
app.use('/api', routes);
app.use('/api/specialties', specialtyRouter);

// Middleware de erro
app.use(errorHandler);

export { app }; 