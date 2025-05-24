import dotenv from 'dotenv';

dotenv.config();

// Função para processar origens CORS
const parseCorsOrigins = (origins: string | undefined): string | string[] => {
  if (!origins) return 'http://localhost:5173';
  if (origins.includes(',')) {
    return origins.split(',').map(origin => origin.trim());
  }
  return origins;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: parseCorsOrigins(process.env.CORS_ORIGIN)
}; 