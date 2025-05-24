import 'dotenv/config';
import { app } from './app';
import { env } from './config/env';

const port = env.PORT || 3001;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log('Variáveis de ambiente carregadas:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
}); 