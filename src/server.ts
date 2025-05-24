import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Swagger documentation available at http://localhost:${env.PORT}/api-docs`);
}); 